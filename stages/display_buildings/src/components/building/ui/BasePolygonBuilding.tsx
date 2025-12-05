import { useRef } from "react";
import * as THREE from "three";
import { Building } from "../../../types/types";
import { ThreeEvent } from "@react-three/fiber";

type OnClickFunction = (building: Building) => void;

interface Props {
  building: Building;
  opacity?: number;
  //  onClick?: (buildingId: string) => void;
  onClick?: OnClickFunction;
}

const handleClick = (
  onClick: OnClickFunction,
  building: Building
) => (event: ThreeEvent<MouseEvent>) => {
  event.stopPropagation();
  onClick(building);

  const { id, address, position, height, nodes } = building;
  console.log({ id, address, position, height, nodes });
}

export const BasePolygonBuilding = ({
  building,
  opacity = 1.0,
  onClick = () => null,
}: Props) => {
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
          onClick={handleClick(onClick, building)}
        >
          <boxGeometry args={[length, height, 0.1]} />
          <meshStandardMaterial
            color={building.address ? "#8B4513" : "#A9A9A9"}
            roughness={0.8}
            metalness={0.2}
            transparent={opacity < 1.0}
            opacity={opacity}
          />
        </mesh>,
      );
    }
  }

  return <group ref={meshRef}>{meshes}</group>;
};
