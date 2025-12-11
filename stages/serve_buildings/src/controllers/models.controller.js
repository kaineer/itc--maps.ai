const { handleError } = require("../errors/application.errors");

const createModelsController = (modelsService) => {
  const createMetadata = async (request, reply) => {
    try {
      const { modelId } = request.body;
      if (!modelId) {
        return shouldSpecifyId(reply);
      }
      const result = await modelsService.createMetadata(modelId);
      return metadataCreated(reply, result);
    } catch (error) {
      return handleError(error, reply);
    }
  };

  const updateMetadata = async (request, reply) => {
    try {
      const { modelId } = request.params;
      const updates = request.body;

      // TODO: Проверка на присутствие position, rotation, scale

      const result = await modelsService.updateMetadata(modelId, updates);
      return reply.send(result);
    } catch (error) {
      return handleError(error, reply);
    }
  };

  const getAllModels = async (request, reply) => {
    try {
      const models = await modelsService.getAllModels();
      return reply.send(models);
    } catch {
      return handleError(reply);
    }
  };

  const getModel = async (request, reply) => {
    try {
      const { modelId } = request.params;
      const model = await modelsService.getModel(modelId);
      return reply.send(model);
    } catch (error) {
      return handleError(reply);
    }
  };

  return {
    getModel,
    getAllModels,
    createMetadata,
    updateMetadata,
  };
};

module.exports = { createModelsController };
