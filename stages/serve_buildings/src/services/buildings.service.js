const { createImportService } = require("./import.service");
const { createModelsService } = require("./models.service");

const createBuildingsService = () => {
  let buildingsData = null;
  const importDir = join(__dirname, "../../../import/");
  const { readJSONFile } = createImportService(importDir);
  const { getAllModels } = createModelsService();

  const getStaticBuildingsData0 = async () => {
    return readJSONFile("buildings.json");
  };
  const getStaticBuildingsData = async () => {
    if (buildingsData === null) {
      buildingsData = await getStaticBuildingsData0();
    }
    return buildingsData;
  };

  const getModelsData = async () => {
    const models = await getAllModels();
    return models.filter(
      (m) => Array.isArray(m.polygons) && m.polygons.length > 2,
    );
  };

  const createMapPolygonData = async () => {
    const usedModelCache = {};

    const modelsData = await getModelsData();
    const modelsCache = modelsData.reduce((acc, model) => {
      model.polygons.forEach((polygonId) => (acc[polygonId] = model));
    }, {});

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
  };

  const getBuildingsInDistance = async (x, z, distance) => {};
};

module.exports = {
  createBuildingsService,
};
