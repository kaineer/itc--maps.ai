const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const fs = require("fs").promises;
const path = require("path");

// Load building data
let buildingsData = [];
let itcData = {};

// Function to calculate distance between two points
function calculateDistance(point1, point2) {
  const dx = point1[0] - point2[0];
  const dz = point1[1] - point2[1];
  return Math.sqrt(dx * dx + dz * dz);
}

// Function to check if any node of a building is within distance from center
function isBuildingWithinDistance(building, center, maxDistance) {
  for (const node of building.nodes) {
    const distance = calculateDistance(node, center);
    if (distance <= maxDistance) {
      return true;
    }
  }
  return false;
}

// Load data on startup
async function loadData() {
  try {
    // Load buildings data
    const buildingsPath = path.join(__dirname, "../import/buildings.json");
    const buildingsContent = await fs.readFile(buildingsPath, "utf8");
    const parsedBuildings = JSON.parse(buildingsContent);
    buildingsData = parsedBuildings.buildings || [];

    // Load ITC data
    const itcPath = path.join(__dirname, "../import/itc.json");
    const itcContent = await fs.readFile(itcPath, "utf8");
    itcData = JSON.parse(itcContent);

    fastify.log.info(`Loaded ${buildingsData.length} buildings`);
    fastify.log.info(`ITC center: ${JSON.stringify(itcData.center)}`);
  } catch (error) {
    fastify.log.error("Error loading data:", error);
    throw error;
  }
}

// Define PUT /buildings endpoint
fastify.put(
  "/buildings",
  {
    schema: {
      body: {
        type: "object",
        required: ["position", "distance"],
        properties: {
          position: {
            type: "object",
            required: ["x", "z"],
            properties: {
              x: { type: "number" },
              z: { type: "number" },
            },
          },
          distance: { type: "number", minimum: 0 },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            buildings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  address: { type: ["string", "null"] },
                  nodes: {
                    type: "array",
                    items: {
                      type: "array",
                      items: { type: "number" },
                      minItems: 2,
                      maxItems: 2,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const { position, distance } = request.body;

    fastify.log.info(
      `Received request: position=${JSON.stringify(position)}, distance=${distance}`,
    );

    // Filter buildings that have at least one node within the specified distance
    const filteredBuildings = buildingsData.filter((building) =>
      isBuildingWithinDistance(building, [position.x, position.z], distance),
    );

    fastify.log.info(
      `Found ${filteredBuildings.length} buildings within distance ${distance}`,
    );

    // Format response according to specification
    const responseBuildings = filteredBuildings.map((building) => ({
      address: building.address,
      height: building.height,
      nodes: building.nodes,
    }));

    return {
      buildings: responseBuildings,
    };
  },
);

// GET /start endpoint - returns ITC center coordinates
fastify.get(
  "/start",
  {
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            x: { type: "number" },
            z: { type: "number" },
          },
        },
      },
    },
  },
  async (request, reply) => {
    return {
      x: itcData.center[0],
      z: itcData.center[1],
    };
  },
);

// Health check endpoint
fastify.get("/health", async (request, reply) => {
  return {
    status: "ok",
    buildingsLoaded: buildingsData.length,
    itcCenter: itcData.center,
  };
});

// Start server
const start = async () => {
  try {
    // Load data first
    await loadData();

    // Register CORS
    await fastify.register(cors, {
      origin: true, // Allow all origins
      methods: ["GET", "PUT", "POST", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    // Start server
    await fastify.listen({ port: 5000, host: "0.0.0.0" });
    fastify.log.info(`Server running on http://localhost:5000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
