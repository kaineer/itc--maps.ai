const { createImportService } = require("./import.service");
const { normalizeAddress } = require("../utils/address");
const { join } = require("path");

const createBuildingsService = () => {
  let buildingsData = null;
  const importDir = join(__dirname, "../../../import/");
  const { readJSONFile } = createImportService(importDir);

  const getStaticBuildingsData0 = async () => {
    return readJSONFile("buildings.json", { buildings: [] });
  };
  const getStaticBuildingsData = async () => {
    if (!buildingsData) {
      buildingsData = (await getStaticBuildingsData0()).buildings;
    }
    return buildingsData;
  };

  const getModelsData = async () => {
    const models = await getAllModels();
    return models.filter(
      (m) => Array.isArray(m.polygons) && m.polygons.length > 0,
    );
  };

  const findBuildingByAddress = async (address) => {
    const normalizedAddress = normalizeAddress(address);
    const buildings = await getStaticBuildingsData();

    return buildings.find(({ address }) => {
      return address && normalizeAddress(address).includes(normalizedAddress);
    });
  };

  // TODO: make it work
  const createMapPolygonData = async () => {
    const usedModelCache = {};

    const modelsData = await getModelsData();
    const modelsCache = modelsData.reduce((acc, model) => {
      model.polygons.forEach((polygonId) => (acc[polygonId] = model));
    }, {});

    // TODO: where it should be used?
    const filterPolygon = (polygon) => {
      const model = modelsCache[polygon.id];
      const modelId = polygon.id;
      if (modelId) {
        if (!usedModelCache[modelId]) {
          usedModelCache[modelId] = true;

          const importedModel = {
            ...polygon,
            position: model.position,
            rotation: model.rotation,
            scale: model.scale,
            address: model.address,
            nodes: [],
            modelId,
            modelUrl: "/model/" + modelId,
          };

          return importedModel;
        }
        return null;
      }
      return polygon;
    };

    return filterPolygon;
  };

  const getBuildingsInDistance = async (x, z, distance) => {
    // TODO: filter buildings closer than distance
    // TODO: filter polygons with filterPolygon from createMapPolygonData
    // TODO: filter non-null elements
    // then return
  };

  return {
    // TODO: getBuildingsInDistance,
    findBuildingByAddress,
  };
};

module.exports = {
  createBuildingsService,
};
