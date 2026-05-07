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
    let meshCount = 0;

    // First pass: count vertices and fix geometry
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++;
        const mesh = child as THREE.Mesh;
        const { geometry } = mesh;

        if (geometry) {
          vertexCount += geometry.attributes.position?.count || 0;

          // Fix geometry issues
          fixGeometryProperties(geometry);
        }
      }
    });

    // Second pass: fix material properties to prevent transparency issues
    let materialCount = 0;
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mesh = child as THREE.Mesh;

        // Handle single material
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            // Handle material array
            mesh.material.forEach((material) => {
              if (material) {
                fixMaterialProperties(material);
                materialCount++;
              }
            });
          } else {
            // Handle single material
            fixMaterialProperties(mesh.material);
            materialCount++;
          }
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

  // Helper function to fix geometry properties
  const fixGeometryProperties = (geometry: THREE.BufferGeometry) => {
    // Always recompute normals to ensure they're correct
    geometry.computeVertexNormals();

    // Ensure geometry has UV coordinates (for textures)
    if (!geometry.attributes.uv || geometry.attributes.uv.count === 0) {
      // Create simple UV coordinates if missing
      const count = geometry.attributes.position.count;
      const uvArray = new Float32Array(count * 2);
      for (let i = 0; i < count; i++) {
        uvArray[i * 2] = 0;
        uvArray[i * 2 + 1] = 0;
      }
      geometry.setAttribute("uv", new THREE.BufferAttribute(uvArray, 2));
    }

    // Compute bounding sphere for frustum culling
    if (!geometry.boundingSphere) {
      geometry.computeBoundingSphere();
    }

    // Compute bounding box
    if (!geometry.boundingBox) {
      geometry.computeBoundingBox();
    }

    // Mark geometry as needing update
    geometry.attributes.position.needsUpdate = true;
    if (geometry.attributes.normal) {
      geometry.attributes.normal.needsUpdate = true;
    }
    if (geometry.attributes.uv) {
      geometry.attributes.uv.needsUpdate = true;
    }

    // Force geometry update
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
  };

  // Helper function to fix material properties
  const fixMaterialProperties = (material: THREE.Material) => {
    const materialType = material.type;
    const materialName = material.name || "unnamed";

    // Handle MeshStandardMaterial and MeshBasicMaterial specifically
    if (
      material instanceof THREE.MeshStandardMaterial ||
      material instanceof THREE.MeshBasicMaterial ||
      material instanceof THREE.MeshPhongMaterial ||
      material instanceof THREE.MeshLambertMaterial
    ) {
      // Force material to be fully opaque and visible
      material.transparent = false;
      material.opacity = 1.0;
      material.side = THREE.DoubleSide; // Critical for architectural models
      material.depthWrite = true;
      material.depthTest = true;
      material.needsUpdate = true;

      // Disable any alpha blending or testing
      (material as any).alphaTest = 0;
      (material as any).premultipliedAlpha = false;
      (material as any).blending = THREE.NormalBlending;

      // For MeshStandardMaterial, set reasonable defaults
      if (material instanceof THREE.MeshStandardMaterial) {
        material.metalness = 0.1; // Low metalness for buildings
        material.roughness = 0.8; // High roughness for matte surfaces
        material.flatShading = false;
        material.envMapIntensity = 1.0;

        // Ensure material has a color if it's black/transparent
        if (material.color.getHex() === 0x000000) {
          material.color.setHex(0x808080); // Default gray color
        }
      }

      // For MeshBasicMaterial, ensure it has a color
      if (material instanceof THREE.MeshBasicMaterial) {
        if (material.color.getHex() === 0x000000) {
          material.color.setHex(0x808080); // Default gray color
        }
      }
    } else {
      // For other material types, use aggressive fixing
      const mat = material as any;

      // Force all critical properties
      if (typeof mat.transparent !== "undefined") {
        mat.transparent = false;
      }

      if (typeof mat.opacity !== "undefined") {
        mat.opacity = 1.0;
      }

      if (typeof mat.side !== "undefined") {
        mat.side = THREE.DoubleSide;
      }

      if (typeof mat.depthWrite !== "undefined") {
        mat.depthWrite = true;
      }

      if (typeof mat.depthTest !== "undefined") {
        mat.depthTest = true;
      }

      // Disable alpha features
      if (typeof mat.alphaTest !== "undefined") {
        mat.alphaTest = 0;
      }

      if (typeof mat.premultipliedAlpha !== "undefined") {
        mat.premultipliedAlpha = false;
      }

      if (typeof mat.blending !== "undefined") {
        mat.blending = THREE.NormalBlending;
      }

      // Ensure material has a color
      if (mat.color && typeof mat.color.setHex === "function") {
        if (mat.color.getHex() === 0x000000) {
          mat.color.setHex(0x808080); // Default gray color
        }
      }

      if (typeof mat.needsUpdate !== "undefined") {
        mat.needsUpdate = true;
      }
    }
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
