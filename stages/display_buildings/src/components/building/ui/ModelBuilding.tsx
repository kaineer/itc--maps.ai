import { useEffect, useState, useRef } from "react";
import { Box3 } from "three";

import { Building } from "@.types/buildings-types";
import { modelsCache } from "@utils/modelsCache";
import { ModelData } from "@utils/modelTransform";

interface Props {
  building: Building;
  onClick?: (building: Building) => void;
  debugNormals?: boolean;
}

export const ModelBuilding = ({
  building,
  onClick = () => null,
  debugNormals = false,
}: Props) => {
  const { model: modelId, modelMetadata } = building;
  const { position, rotation, scale } = modelMetadata || {};

  const [modelObject, setModelObject] = useState<
    ModelData["modelObject"] | null
  >(null);
  const [adjustedPosition, setAdjustedPosition] = useState<
    [number, number, number] | undefined
  >(undefined);
  const positionRef = useRef<[number, number, number] | undefined>(position);
  const scaleRef = useRef<number | undefined>(scale);
  const modelObjectRef = useRef<ModelData["modelObject"] | null>(null);

  useEffect(() => {
    // Update refs when position or scale changes
    positionRef.current = position;
    scaleRef.current = scale;
  }, [position, scale]);

  useEffect(() => {
    const loadModelObject = async () => {
      if (modelId) {
        try {
          const loadedModel = await modelsCache.getModel(modelId);
          if (loadedModel) {
            setModelObject(loadedModel.modelObject);
            modelObjectRef.current = loadedModel.modelObject;

            // Debug: log model structure
            console.log(`🏢 ModelBuilding loaded model ${modelId}:`);
            console.log(`   Bounding box:`, loadedModel.metadata.boundingBox);
            console.log(`   Vertex count:`, loadedModel.metadata.vertexCount);

            // Debug: log materials in model
            let materialCount = 0;
            loadedModel.modelObject.traverse((child: any) => {
              if (child.isMesh && child.material) {
                materialCount++;
                const materials = Array.isArray(child.material)
                  ? child.material
                  : [child.material];

                materials.forEach((material: any, index: number) => {
                  console.log(`   Material ${materialCount}.${index + 1}:`, {
                    type: material.type,
                    name: material.name || "unnamed",
                    transparent: material.transparent,
                    opacity: material.opacity,
                    side: material.side,
                    depthWrite: material.depthWrite,
                    depthTest: material.depthTest,
                  });
                });
              }
            });
            console.log(`   Total materials: ${materialCount}`);

            // Temporary hack: calculate adjusted position based on model bbox
            calculateAndSetAdjustedPosition(loadedModel.modelObject);
          } else {
            console.warn(`⚠️ ModelBuilding: Failed to load model ${modelId}`);
            setModelObject(null);
            setAdjustedPosition(positionRef.current);
          }
        } catch (err) {
          console.error(
            `❌ ModelBuilding: Error loading model ${modelId}:`,
            err,
          );
          setModelObject(null);
          setAdjustedPosition(positionRef.current);
        }
      }
    };

    if (modelId) {
      console.log(`📥 ModelBuilding: Loading model ${modelId}...`);
      loadModelObject();
    }
  }, [modelId]);

  // Recalculate adjusted position when position or scale changes
  useEffect(() => {
    if (modelObjectRef.current) {
      calculateAndSetAdjustedPosition(modelObjectRef.current);
    }
  }, [position, scale]);

  const handleClick = () => {
    onClick(building);
  };

  // Helper function to calculate adjusted position
  const calculateAndSetAdjustedPosition = (
    modelObj: ModelData["modelObject"],
  ) => {
    const currentPosition = positionRef.current;
    const currentScale = scaleRef.current;

    if (currentPosition) {
      try {
        // Calculate bounding box for the model
        const bbox = new Box3().setFromObject(modelObj);

        // Calculate scale factor (use the scale from metadata)
        const modelScale = currentScale || 1;

        // Calculate the minimum Y value in world coordinates after scaling
        const minY = bbox.min.y * modelScale;

        // Calculate yOffset to place bottom of model at ground level (y=0)
        const yOffset = -minY;

        // Set adjusted position with corrected Y coordinate
        setAdjustedPosition([currentPosition[0], yOffset, currentPosition[2]]);
      } catch (error) {
        setAdjustedPosition(currentPosition);
      }
    } else {
      setAdjustedPosition(currentPosition);
    }
  };

  const rotY = (((rotation && rotation[1]) || 0) * Math.PI) / 180;
  const finalPosition = adjustedPosition || positionRef.current;

  if (!modelObject) return null;

  // Debug: log final position and scale
  console.log(`🎯 ModelBuilding ${modelId}:`, {
    position: finalPosition,
    scale,
    rotationY: rotY,
  });

  return (
    <>
      <primitive
        onClick={handleClick}
        object={modelObject}
        rotation={[0, rotY, 0]}
        position={finalPosition}
        scale={[scale, scale, scale]}
      />
      {debugNormals && (
        <group>
          {(() => {
            const normalHelpers: JSX.Element[] = [];
            let helperIndex = 0;

            modelObject.traverse((child: any) => {
              if (child.isMesh && child.geometry) {
                const geometry = child.geometry;
                if (
                  geometry.attributes.position &&
                  geometry.attributes.normal
                ) {
                  const positions = geometry.attributes.position.array;
                  const normals = geometry.attributes.normal.array;
                  const count = geometry.attributes.position.count;

                  // Sample some normals for visualization (every 10th vertex)
                  for (let i = 0; i < count; i += 10) {
                    const x = positions[i * 3];
                    const y = positions[i * 3 + 1];
                    const z = positions[i * 3 + 2];

                    const nx = normals[i * 3];
                    const ny = normals[i * 3 + 1];
                    const nz = normals[i * 3 + 2];

                    // Create a small line for the normal
                    normalHelpers.push(
                      <line key={`normal-${helperIndex++}`}>
                        <bufferGeometry>
                          <bufferAttribute
                            attach="attributes-position"
                            count={2}
                            array={
                              new Float32Array([
                                x,
                                y,
                                z,
                                x + nx * 0.5,
                                y + ny * 0.5,
                                z + nz * 0.5,
                              ])
                            }
                            itemSize={3}
                          />
                        </bufferGeometry>
                        <lineBasicMaterial color="#ff0000" linewidth={2} />
                      </line>,
                    );
                  }
                }
              }
            });

            return normalHelpers;
          })()}
        </group>
      )}
    </>
  );
};
