import { useFBX } from "@react-three/drei";
import { Building } from "../../../types/types";
import { useEffect, useState } from "react";
import { Box3, Vector3, Mesh, MeshBasicMaterial } from "three";

interface Props {
  building: Building;
}

export function DebugModelBuilding({ building }: Props) {
  const { modelUrl, position = { x: 0, z: 0 } } = building;
  const debug = true;
  const targetSize = 20;

  // const model = useFBX("http://10.1.0.71" + modelUrl!);
  const model = useFBX("" + modelUrl!);

  const [scale, setScale] = useState(1);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    if (model) {
      // Apply wireframe to all meshes
      model.traverse((child) => {
        if (child instanceof Mesh) {
          const originalMaterial = child.material;
          // Create wireframe material
          const wireframeMaterial = new MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
            transparent: true,
            opacity: 0.8,
          });
          child.material = wireframeMaterial;

          // Store original material for potential restoration
          child.userData.originalMaterial = originalMaterial;
        }
      });

      const box = new Box3().setFromObject(model);
      const size = box.getSize(new Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const calculatedScale = targetSize / maxDimension;
      setScale(calculatedScale);

      // Calculate Y offset to place bottom of model at ground level (y=0)
      const minY = box.min.y * calculatedScale;
      const calculatedYOffset = -minY;
      setYOffset(calculatedYOffset);

      if (debug) {
        console.log("Model debug info:", {
          originalSize: size,
          maxDimension,
          calculatedScale,
          targetSize,
          meshCount: countMeshes(model),
          boundingBox: { min: box.min, max: box.max },
          yOffset: calculatedYOffset,
        });
      }
    }
  }, [model, targetSize, debug]);

  // Helper function to count meshes
  function countMeshes(object: any): number {
    let count = 0;
    object.traverse((child: any) => {
      if (child instanceof Mesh) {
        count++;
      }
    });
    return count;
  }

  if (!model) return null;

  const modelPosition = new Vector3(position.x, yOffset, position.z);

  return (
    <group
      onClick={(event) => {
        event.stopPropagation();
        console.log("Building clicked:", {
          address: building.address,
          position: building.position,
          modelUrl: building.modelUrl,
        });
      }}
    >
      <primitive
        object={model}
        scale={[scale, scale, scale]}
        position={modelPosition}
      />

      {/* Визуальная отладка */}
      {debug && (
        <>
          <axesHelper args={[targetSize * 0.5]} />
          <mesh position={modelPosition}>
            <boxGeometry
              args={[targetSize * 0.1, targetSize * 0.1, targetSize * 0.1]}
            />
            <meshBasicMaterial color="red" wireframe />
          </mesh>
        </>
      )}
    </group>
  );
}
