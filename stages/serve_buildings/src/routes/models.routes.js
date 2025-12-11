const { createModelsService } = require("../services/models.service");
const { createModelsController } = require("../controllers/models.controller");
const {
  createMetadataSchema,
  updateMetadataSchema,
  getModelSchema,
  getAllModelsSchema,
} = require("../schemas/models.schema");

const modelsRoutes = async (fastify /* , options*/) => {
  const modelsController = createModelsController(createModelsService());

  fastify.post(
    "/models",
    {
      schema: createMetadataSchema,
    },
    modelsController.createMetadata,
  );

  fastify.patch(
    "/models/:modelId",
    {
      schema: updateMetadataSchema,
    },
    modelsController.updateMetadata,
  );

  fastify.get(
    "/models/:modelId",
    { schema: getModelSchema },
    modelsController.getModel,
  );

  fastify.get(
    "/models",
    { schema: getAllModelsSchema },
    modelsController.getAllModels,
  );
};

module.exports = {
  modelsRoutes,
};
