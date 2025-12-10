const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const multipart = require("@fastify/multipart");
const fs = require("fs").promises;
const path = require("path");
const { pipeline } = require("stream/promises");
const { createWriteStream, createReadStream } = require("fs");
const { v4: uuid } = require("uuid");

// Load building data
let buildingsData = [];
let itcData = {};

const modelsData = [
  // {
  //   modelId: "1",
  //   modelUrl: "/itc.fbx",
  //   buildingIds: ["59831701", "59831708", "59831705"],
  // },
];

const modelsCache = modelsData.reduce((acc, item) => {
  const { modelId, buildingIds } = item;
  buildingIds.forEach((bid) => (acc[bid] = modelId));
  return acc;
}, {});

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
                  id: { type: ["string"] },
                  address: { type: ["string", "null"] },
                  height: { type: "number" },
                  modelUrl: { type: ["string", "null"] },
                  nodes: {
                    type: "array",
                    items: {
                      ...positionScheme,
                      required: ["x", "z"],
                    },
                  },
                  position: {
                    ...positionScheme,
                    type: ["object", "null"],
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
  async (request, reply) => {
    const { position, distance } = request.body;

    fastify.log.info(
      `Received request: position=${JSON.stringify(position)}, distance=${distance}`,
    );

    const createMapPolygonData = () => {
      const usedModelCache = {};

      const filterPolygon = (polygon) => {
        const modelId = modelsCache[polygon.id];
        if (modelId) {
          console.log("Found model: " + modelId);

          if (!usedModelCache[modelId]) {
            usedModelCache[modelId] = true;

            console.log(
              "Found model " + modelId + " for polygon " + polygon.id,
            );

            const importedModel = {
              ...polygon,
              nodes: [],
              position: polygon.nodes[0],
              modelId,
              modelUrl: modelsData.find((d) => d.modelId === modelId).modelUrl,
            };

            console.log({ importedModel });

            return importedModel;
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
      ({ id, address, height, nodes, modelUrl, position }) => ({
        id,
        address,
        height,
        nodes,
        modelUrl,
        position,
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

fastify.post("/upload", async (request, reply) => {
  const data = await request.file();
  const fileStream = data.file;
  const fileId = uuid();
  const filename = fileId + ".fbx";

  const savePath = path.join(__dirname, "public", filename);
  await pipeline(fileStream, createWriteStream(savePath));

  return { message: "ok", fileId };
});

const registerModelsRoute = (fastify) => {
  fastify.get("/model/:modelId", async (request, reply) => {
    const { modelId } = request.params;

    // Валидация modelId для предотвращения path traversal атак
    if (!modelId || modelId.includes("..") || modelId.includes("/")) {
      throw fastify.httpErrors.badRequest("Некорректный ID модели");
    }

    // Формируем путь к файлу в директории public
    // Предполагаем, что public находится в корне проекта
    const modelPath = path.join(process.cwd(), "public", `${modelId}.fbx`);

    try {
      // Проверяем существование файла
      await fs.access(modelPath);

      // Определяем MIME-тип для FBX файлов
      // FBX обычно имеет MIME-тип application/octet-stream или text/plain
      const mimeType = "application/octet-stream";

      // Отправляем файл
      return reply
        .header("Content-Type", mimeType)
        .header("Content-Disposition", `inline; filename="${modelId}.fbx"`)
        .send(createReadStream(modelPath));
    } catch (error) {
      if (error.code === "ENOENT") {
        throw fastify.httpErrors.notFound(
          `Модель с ID "${modelId}" не найдена`,
        );
      }
      throw error;
    }
  });
};

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
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    await fastify.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10mb
        files: 5,
      },
    });

    // NOTE: should be run **before** static registering
    registerModelsRoute(fastify);

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
