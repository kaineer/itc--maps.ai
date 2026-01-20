const { createBuildingsService } = require("../services/buildings.service");
const {
  createBuildingsController,
} = require("../controllers/buildings.controller");

const buildingsRoutes = async (fastify) => {
  const buildingsController = createBuildingsController(
    createBuildingsService(),
  );

  fastify.put(
    "/buildings/address",
    {},
    buildingsController.findBuildingByAddress,
  );
};

module.exports = { buildingsRoutes };
