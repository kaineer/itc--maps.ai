const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const fs = require("fs").promises;
const path = require("path");

// Load building data
let buildingsData = [];
let itcData = {};

const modelsData = [
  {
    modelId: "1",
    modelUrl: "/itc.fbx",
    buildingIds: ["59831701", "59831708", "59831705"],
  },
];

const modelsCache = modelsData.reduce((acc, item) => {
  const { modelId, buildingIds } = item;
  buildingIds.forEach((bid) => (acc[bid] = modelId));
  return acc;
}, {});

console.log(modelsCache);

// Function to calculate distance between two points
function calculateDistance(point1, point2) {
  const dx = point1.x - point2.x;
  const dz = point1.z - point2.z;
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

const positionScheme = {
  type: "object",
  required: ["x", "z"],
  properties: {
    x: { type: "number" },
    z: { type: "number" },
  },
};

// Define PUT /buildings endpoint
fastify.put(
  "/buildings",
  {
    schema: {
      body: {
        type: "object",
        required: ["position", "distance"],
        properties: {
          position: positionScheme,
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
                  height: { type: "number" },
                  nodes: {
                    type: "array",
                    items: {
                      ...positionScheme,
                      required: ["x", "z"],
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

    const createMapPolygonData = () => {
      const usedModelCache = {};

      const filterPolygon = (polygon) => {
        if (polygon.id.startsWith("598")) {
          console.log("Checking polygon: " + polygon.id);
        }
        const modelId = modelsCache[polygon.id];
        if (modelId) {
          console.log("Found model: " + modelId);

          if (!usedModelCache[modelId]) {
            usedModelCache[modelId] = true;

            console.log(
              "Found model " + modelId + " for polygon " + polygon.id,
            );

            return {
              ...polygon,
              nodes: [],
              modelId,
              modelUrl: modelsData.find((d) => d.modelId === modelId).modelUrl,
            };
          }
          return null;
        }
        return polygon;
      };

      return filterPolygon;
    };

    // Filter buildings that have at least one node within the specified distance
    const filteredBuildings = buildingsData
      .filter((building) =>
        isBuildingWithinDistance(building, position, distance),
      )
      .map(createMapPolygonData())
      .filter((x) => x !== null);

    fastify.log.info(
      `Found ${filteredBuildings.length} buildings within distance ${distance}`,
    );

    // Format response according to specification
    const responseBuildings = filteredBuildings.map(
      ({ address, height, nodes }) => ({
        address,
        height,
        nodes,
      }),
    );

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
          required: ["x", "z"],
        },
      },
    },
  },
  async (request, reply) => {
    return {
      x: itcData.center.x,
      z: itcData.center.z,
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

    // Serve static files from public directory
    await fastify.register(require("@fastify/static"), {
      root: path.join(__dirname, "public"),
      prefix: "/",
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
