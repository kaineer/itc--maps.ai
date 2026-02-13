import * as THREE from "three";
import { ModelData } from "./modelTransform";
import { createBackendService } from "@services/backendService";
import { AuthorizedFBXLoader } from "./authorizedFBXLoader";

type GroupPromise = Promise<THREE.Group>;

export const createModelsCache = () => {
  const cache = new Map<string, ModelData>();
  const loadingPromises = new Map<string, GroupPromise>();
  const backendService = createBackendService();

  // private
  const loadModel = async (modelId: string): GroupPromise => {
    const loader = new AuthorizedFBXLoader();

    const modelUrl = backendService.urlForEndpoint("model/" + modelId);
    return new Promise((resolve, reject) => {
      loader.load(modelUrl, resolve, undefined, reject);
    });
  };

  // public
  const disposeModel = (modelId: string) => {
    const model = cache.get(modelId);
    if (model) {
      const { modelObject } = model;

      modelObject.traverse((child: any) => {
        if (typeof child.dispose === "function") {
          child.dispose();
        }
      });
      cache.delete(modelId);
    }
  };

  const getModelData = (modelId: string, model: THREE.Group) => {
    const boundingBox = new THREE.Box3().setFromObject(model);
    let vertexCount = 0;

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const { geometry } = child;
        if (geometry) {
          vertexCount += geometry.attributes.position?.count || 0;
        }
      }
    });

    return {
      id: modelId,
      modelObject: model,
      metadata: {
        fileFormat: "fbx",
        vertexCount,
        boundingBox,
      },
    };
  };

  // public
  const getModel = async (modelId: string): Promise<ModelData | null> => {
    if (cache.has(modelId)) {
      return cache.get(modelId) || null;
    }

    if (loadingPromises.has(modelId)) {
      const modelObject = await loadingPromises.get(modelId);
      if (modelObject) {
        const modelData: ModelData | null = getModelData(modelId, modelObject);
        return modelData;
      }
      return null;
    }

    const loadPromise = loadModel(modelId); // backend GET "/model/:modelId"
    loadingPromises.set(modelId, loadPromise);

    try {
      const model = await loadPromise;
      const modelData = getModelData(modelId, model);
      cache.set(modelId, modelData);
      return modelData;
    } finally {
      loadingPromises.delete(modelId);
    }
  };

  return {
    getModel,
    disposeModel,
  };
};

export const modelsCache = createModelsCache();
