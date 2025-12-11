const typeString = { type: "string" };
const typeNumber = { type: "number" };

const arrayOf = (type) => ({
  type: "array",
  items: { type },
});

const numberArray = arrayOf("number");
const stringArray = arrayOf("string");

const uuidPattern =
  "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$";

const metadata = {
  type: "object",
  properties: {
    modelId: typeString,
    address: typeString,
    bbox: numberArray,
    position: numberArray,
    rotation: typeNumber,
    scale: typeNumber,
    polygons: stringArray,
  },
};

const createMetadataSchema = {
  body: {
    type: "object",
    required: ["modelId"],
    properties: {
      modelId: {
        type: "string",
        pattern: uuidPattern,
      },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        modelId: typeString,
      },
    },
  },
};

const updateMetadataSchema = {
  params: {
    type: "object",
    required: ["modelId"],
    properties: {
      modelId: {
        type: "string",
        pattern: uuidPattern,
      },
    },
  },
  body: metadata,
};

const getModelSchema = {
  params: {
    type: "object",
    required: ["modelId"],
    properties: {
      modelId: {
        type: "string",
        pattern: uuidPattern,
      },
    },
  },
};

const getAllModelsSchema = {
  response: {
    200: {
      type: "array",
      items: metadata,
    },
  },
};

module.exports = {
  createMetadataSchema,
  updateMetadataSchema,
  getModelSchema,
  getAllModelsSchema,
};
