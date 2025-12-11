const typeString = { type: "string" };
const typeObject = { type: "object" };

const uploadSchema = {
  body: {
    ...typeObject,
    required: ["file"],
    properties: {
      file: typeString,
    },
  },
  response: {
    200: {
      ...typeObject,
      properties: {
        modelId: typeString,
        message: typeString,
      },
    },
  },
};

module.exports = { uploadSchema };
