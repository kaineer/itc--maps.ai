const { join } = require("path");
const fs = require("fs/promises");
const { validate: validateUuid } = require("uuid");
const {
  ValidationError,
  NotFoundError,
  ConflictError,
} = require("../errors/application.errors");
const { createModelCache } = require("./modelCache");

const j2 = (obj) => JSON.stringify(obj, null, 2);

const createModelsService = () => {
  const uploadDir = join(__dirname, "../../public");
  const getModelPath = (modelId) => join(uploadDir, modelId + ".fbx");
  const getMetadataPath = (modelId) =>
    join(uploadDir, modelId + "_metadata.json");

  const modelExists = async (modelId) => {
    try {
      await fs.access(getModelPath(modelId));
      return true;
    } catch {
      return false;
    }
  };

  const getAllModels0 = async () => {
    try {
      const files = await fs.readdir(uploadDir);
      const models = [];

      for (const file of files) {
        if (file.endsWith(".fbx")) {
          const modelId = file.replace(".fbx", "");

          if (validateUuid(modelId)) {
            models.push(await getModel0(modelId));
          }
        }
      }

      return models;
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  };

  const cache = createModelCache(getAllModels0);

  const createMetadata0 = async (modelId) => {
    const metadataPath = getMetadataPath(modelId);

    const initialMetadata = {
      modelId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(metadataPath, j2(initialMetadata));
    cache.invalidateCache();

    return { modelId };
  };

  const createMetadata = async (modelId) => {
    if (!(await modelExists(modelId))) {
      throw new NotFoundError("Model file not found");
    }

    const metadataPath = getMetadataPath(modelId);

    try {
      await fs.access(metadataPath);
      throw new ConflictError("Metadata file already exists");
    } catch (error) {
      return createMetadata0(modelId);
    }
  };

  const formatResponse = (metadata) => {
    const { modelId, position, rotation, scale, address, bbox } = metadata;
    const response = { modelId };

    if (
      typeof position !== "undefined" &&
      typeof rotation === "number" &&
      typeof scale === "number"
    ) {
      Object.assign(response, { position, rotation, scale });
    }

    if (address) {
      response.address = address;
    }

    if (bbox) {
      response.bbox = bbox;
    }

    return response;
  };

  const updateMetadata = async (modelId, updates) => {
    const metadataPath = getMetadataPath(modelId);
    let metadata = {};

    try {
      const data = await fs.readFile(metadataPath, "utf-8");
      metadata = JSON.parse(data);
    } catch {
      metadata = {
        modelId,
        createdAt: new Date().toISOString(),
      };
    }

    Object.assign(metadata, updates, {
      updatedAt: new Date().toISOString(),
    });

    await fs.writeFile(metadataPath, j2(metadata));
    cache.invalidateCache();

    return formatResponse(metadata);
  };

  const getModel0 = async (modelId) => {
    const metadataPath = getMetadataPath(modelId);

    try {
      const data = await fs.readFile(metadataPath, "utf-8");
      const metadata = JSON.parse(data);
      return formatResponse(metadata);
    } catch {
      return { modelId };
    }
  };

  const getModel = async (modelId) => {
    if (!validateUuid(modelId)) {
      throw new ValidationError("Invalid uuid format");
    }

    if (!(await modelExists(modelId))) {
      throw new NotFoundError("Model not found");
    }

    return getModel0(modelId);
  };
  const getAllModels = async () => {
    return await cache.cacheValues();
  };

  const findModelByAddress = async (address) => {
    console.log("findModeByAddress");
    const models = await getAllModels();
    const model = models.find((m) => m.address === address);
    if (!model) {
      throw new NotFoundError("Model with address not found");
    }
    return model;
  };

  return {
    createMetadata,
    updateMetadata,
    getModel,
    getAllModels,
    findModelByAddress,
  };
};

module.exports = { createModelsService };
