import React, { useRef } from "react";
import * as THREE from "three";

interface BuildingNode {
  x: number;
  z: number;
}

interface Building {
  address: string | null;
  nodes: BuildingNode[];
  height: number;
}

const BuildingMesh: React.FC<{ building: Building }> = ({ building }) => {
  const meshRef = useRef<THREE.Group>(null);

  if (!building.nodes || building.nodes.length < 2) {
    return null;
  }

  const meshes = [];

  // Create walls between consecutive nodes
  for (let i = 0; i < building.nodes.length; i++) {
    const current = building.nodes[i];
    const next = building.nodes[(i + 1) % building.nodes.length];

    const currentX = current.x;
    const currentZ = current.z;
    const nextX = next.x;
    const nextZ = next.z;

    if (
      currentX === undefined ||
      currentZ === undefined ||
      nextX === undefined ||
      nextZ === undefined
    )
      continue;

    // Calculate wall position and dimensions
    const midX = (currentX + nextX) / 2;
    const midZ = (currentZ + nextZ) / 2;
    const height = building.height || 3;

    // Calculate wall length and rotation
    const dx = nextX - currentX;
    const dz = nextZ - currentZ;
    const length = Math.sqrt(dx * dx + dz * dz);
    const rotation = Math.atan2(dz, dx);

    if (length > 0) {
      meshes.push(
        <mesh
          key={`wall-${i}`}
          position={[midX, height / 2, midZ]}
          rotation={[0, -rotation, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[length, height, 0.1]} />
          <meshStandardMaterial
            color={building.address ? "#8B4513" : "#A9A9A9"}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>,
      );
    }
  }

  return <group ref={meshRef}>{meshes}</group>;
};

export { BuildingMesh };
