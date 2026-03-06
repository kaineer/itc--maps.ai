import { useEffect, useState } from "react";
import { Box3, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { Building } from "@.types/buildings-types";
import { modelsCache } from "@utils/modelsCache";
import { ModelData } from "@utils/modelTransform";
import classes from "./ModelDebug.module.css";

interface Props {
  building: Building;
}

export const ModelDebug = ({ building }: Props) => {
  const { model: modelId, modelMetadata } = building;
  const { position, rotation, scale } = modelMetadata || {};
  const [modelData, setModelData] = useState<ModelData | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const loadModel = async () => {
      if (!modelId) return;

      try {
        console.log(`🔍 ModelDebug: Loading model ${modelId} for debugging`);
        const loadedModel = await modelsCache.getModel(modelId);
        if (loadedModel) {
          setModelData(loadedModel);
          analyzeModel(loadedModel);
        }
      } catch (error) {
        console.error(`❌ ModelDebug: Failed to load model ${modelId}:`, error);
        setDebugInfo(`Failed to load model: ${error}`);
      }
    };

    loadModel();
  }, [modelId]);

  const analyzeModel = (modelData: ModelData) => {
    const info: string[] = [];
    const { modelObject, metadata } = modelData;

    info.push(`=== Model Analysis: ${modelId} ===`);
    info.push(`Bounding Box: ${JSON.stringify(metadata.boundingBox)}`);
    info.push(`Vertex Count: ${metadata.vertexCount}`);
    info.push(`File Format: ${metadata.fileFormat}`);

    let meshCount = 0;
    let materialCount = 0;
    let geometryCount = 0;
    const materialTypes = new Map<string, number>();
    const geometryTypes = new Map<string, number>();

    modelObject.traverse((child: any) => {
      if (child.isMesh) {
        meshCount++;

        // Analyze geometry
        if (child.geometry) {
          geometryCount++;
          const geomType = child.geometry.type;
          geometryTypes.set(geomType, (geometryTypes.get(geomType) || 0) + 1);

          const geom = child.geometry;
          info.push(`  Geometry [${geomType}]:`);
          info.push(`    Vertices: ${geom.attributes.position?.count || 0}`);
          info.push(`    Has Normals: ${!!geom.attributes.normal}`);
          info.push(`    Has UVs: ${!!geom.attributes.uv}`);
          info.push(`    Indexed: ${!!geom.index}`);
        }

        // Analyze materials
        if (child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((material: any) => {
            materialCount++;
            const matType = material.type;
            materialTypes.set(matType, (materialTypes.get(matType) || 0) + 1);

            info.push(`  Material [${matType}]:`);
            info.push(`    Name: ${material.name || "unnamed"}`);
            info.push(`    Transparent: ${material.transparent}`);
            info.push(`    Opacity: ${material.opacity}`);
            info.push(`    Side: ${material.side}`);
            info.push(`    DepthWrite: ${material.depthWrite}`);
            info.push(`    DepthTest: ${material.depthTest}`);
            info.push(
              `    Color: #${material.color?.getHexString?.() || "N/A"}`,
            );

            if (material.metalness !== undefined) {
              info.push(`    Metalness: ${material.metalness}`);
            }
            if (material.roughness !== undefined) {
              info.push(`    Roughness: ${material.roughness}`);
            }
          });
        }
      }
    });

    info.push(`\n=== Summary ===`);
    info.push(`Total Meshes: ${meshCount}`);
    info.push(`Total Geometries: ${geometryCount}`);
    info.push(`Total Materials: ${materialCount}`);
    info.push(
      `Geometry Types: ${Array.from(geometryTypes.entries())
        .map(([type, count]) => `${type}(${count})`)
        .join(", ")}`,
    );
    info.push(
      `Material Types: ${Array.from(materialTypes.entries())
        .map(([type, count]) => `${type}(${count})`)
        .join(", ")}`,
    );

    // Check for potential issues
    const issues: string[] = [];

    if (meshCount === 0) {
      issues.push("❌ No meshes found in model");
    }

    if (materialCount === 0) {
      issues.push("❌ No materials found in model");
    }

    modelObject.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((material: any) => {
          if (material.transparent) {
            issues.push(
              `⚠️ Material "${material.name || "unnamed"}" is transparent`,
            );
          }
          if (material.opacity < 1.0) {
            issues.push(
              `⚠️ Material "${material.name || "unnamed"}" has opacity ${material.opacity}`,
            );
          }
          if (material.side !== 2) {
            // 2 = THREE.DoubleSide
            issues.push(
              `⚠️ Material "${material.name || "unnamed"}" has side=${material.side} (should be DoubleSide=2)`,
            );
          }
          if (!material.depthWrite) {
            issues.push(
              `⚠️ Material "${material.name || "unnamed"}" has depthWrite=false`,
            );
          }
          if (!material.depthTest) {
            issues.push(
              `⚠️ Material "${material.name || "unnamed"}" has depthTest=false`,
            );
          }
        });
      }
    });

    if (issues.length > 0) {
      info.push(`\n=== Potential Issues ===`);
      issues.forEach((issue) => info.push(issue));
    }

    setDebugInfo(info.join("\n"));
  };

  const fixModelInPlace = () => {
    if (!modelData) return;

    console.log("🛠️ Manually fixing model materials...");

    modelData.modelObject.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((material: any) => {
          // Force fix all materials
          material.transparent = false;
          material.opacity = 1.0;
          material.side = 2; // DoubleSide
          material.depthWrite = true;
          material.depthTest = true;

          if (material.color && typeof material.color.setHex === "function") {
            if (material.color.getHex() === 0x000000) {
              material.color.setHex(0x808080); // Gray
            }
          }

          material.needsUpdate = true;
        });
      }
    });

    // Re-analyze after fixing
    analyzeModel(modelData);
    console.log("✅ Model materials manually fixed");
  };

  if (!modelId) {
    return <div className={classes.modelDebug}>No model ID provided</div>;
  }

  if (!modelData) {
    return <div className={classes.modelDebug}>Loading model {modelId}...</div>;
  }

  return (
    <div className={classes.modelDebug}>
      <h3>Model Debug: {modelId}</h3>

      <div className={classes.controls}>
        <button onClick={fixModelInPlace} className={classes.buttonFix}>
          Force Fix Materials
        </button>

        <button
          onClick={() => analyzeModel(modelData)}
          className={classes.buttonAnalyze}
        >
          Re-analyze
        </button>
      </div>

      <pre className={classes.debugInfo}>{debugInfo}</pre>

      <div className={classes.instructions}>
        <strong>Instructions:</strong>
        <ul>
          <li>Check console for detailed logs</li>
          <li>
            Click "Force Fix Materials" to manually fix transparency issues
          </li>
          <li>Look for "Potential Issues" in the analysis above</li>
        </ul>
      </div>
    </div>
  );
};
