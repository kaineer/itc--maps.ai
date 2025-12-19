import { Vector3, Box3 } from "three";
import { Building } from "../../../types/types";
import { useFBX } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

interface Props {
  building: Building;
  onClick?: (building: Building) => void;
}

const applyToArrayOrElement = <T,>(e: Array<T> | T, fn: (a: T) => void) => {
  if (Array.isArray(e)) {
    (e as Array<T>).forEach(fn);
  } else {
    fn(e as T);
  }
};

export const ModelBuilding = ({ building, onClick = () => null }: Props) => {
  const {
    modelUrl,
    position = { x: 0, z: 0 },
    scale = 1,
    rotation = 0,
  } = building;
  const fbx = useFBX("http://10.1.0.71" + modelUrl!);
  const fbxPosition = [position.x, 0, position.z];

  const handleClick = () => {
    onClick(building);
  };

  if (fbx) {
    const box = new Box3().setFromObject(fbx);
    console.log("Model bounds:", box);
    console.log("Model center:", box.getCenter(new Vector3()));
    console.log("Model size:", box.getSize(new Vector3()));
  }

  const fixMaterial = (material: THREE.Material) => {
    // Приводим к типу, который может иметь карту текстур
    const mat = material as THREE.MeshStandardMaterial;

    if (mat.map) {
      console.log("Texture map found:", mat.map);
      mat.map.encoding = THREE.sRGBEncoding;
      mat.map.flipY = false; // Для FBX обычно false
      mat.map.needsUpdate = true;
    }

    material.needsUpdate = true;
  };

  useEffect(() => {
    if (!fbx) return;

    fbx.traverse((child) => {
      // Правильная проверка типа с приведением
      const mesh = child as THREE.Mesh;

      if (mesh.isMesh && mesh.material) {
        console.log("Mesh found:", mesh.name);

        const material = mesh.material;

        // Проверяем, является ли материал массивом
        if (Array.isArray(material)) {
          material.forEach((mat, index) => {
            console.log(`Material ${index}:`, mat);
            fixMaterial(mat as THREE.Material);
          });
        } else {
          console.log("Material:", material);
          fixMaterial(material as THREE.Material);
        }
      }
    });
  }, [fbx]);

  const rotY = (rotation * Math.PI) / 180;

  return (
    <primitive
      object={fbx}
      position={fbxPosition}
      scale={[scale, scale, scale]}
      rotation={[0, rotY, 0]}
    />
  );
};
