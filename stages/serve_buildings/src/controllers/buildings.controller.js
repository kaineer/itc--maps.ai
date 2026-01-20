const { NotFoundError, handleError } = require("../errors/application.errors");

const createBuildingsController = (buildingsService) => {
  const findBuildingByAddress = async (request, reply) => {
    try {
      const { address } = request.body;
      const model = await buildingsService.findBuildingByAddress(address);
      if (!model) {
        throw new NotFoundError("Не найдена модель с адресом " + address);
      }
      return reply.send(model);
    } catch (error) {
      return handleError(error, reply);
    }
  };

  return {
    findBuildingByAddress,
  };
};

module.exports = {
  createBuildingsController,
};
