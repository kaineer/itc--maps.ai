import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import { urlForModel } from "./backend";

type GroupPromise = Promise<THREE.Group>;

export const createModelsCache = () => {
  const cache = new Map<string, THREE.Group>();
  const loadingPromises = new Map<string, GroupPromise>();

  // private
  const loadModel = async (modelId: string): GroupPromise => {
    const loader = new FBXLoader();
    return new Promise((resolve, reject) => {
      loader.load(urlForModel(modelId), resolve, undefined, reject);
    });
  };

  // public
  const disposeModel = (modelId: string) => {
    const model = cache.get(modelId);
    if (model) {
      model.traverse((child) => {
        if (typeof child.dispose === "function") {
          child.dispose();
        }
      });
      cache.delete(modelId);
    }
  };

  // public
  const getModel = async (modelId: string) => {
    if (cache.has(modelId)) {
      return cache.get(modelId);
    }

    if (loadingPromises.has(modelId)) {
      return loadingPromises.get(modelId);
    }

    const loadPromise = loadModel(modelId); // backend GET "/model/:modelId"
    loadingPromises.set(modelId, loadPromise);

    try {
      const model = await loadPromise;
      cache.set(modelId, model);
      return model;
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
