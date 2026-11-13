import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import type { Street } from "@shared/model/streets-types";
import { UI_COLORS } from "@shared/config/constants";
import { MapItems } from "@kit/utils/MapItems";

interface Props {
  streets: Street[];
  onStreetClick?: (street: Street) => void;
}

const STREET_Y = 0.12;
const STREET_EDGE_Y = 0.02;
const STREET_EDGE_WIDTH = 1.5;

const StreetMesh = ({
  street,
  onStreetClick,
}: {
  street: Street;
  onStreetClick?: (street: Street) => void;
}) => {
  const { geometry, origin, edgePoints } = useMemo(() => {
    if (!street.nodes || street.nodes.length < 3) {
      return { geometry: null, origin: null, edgePoints: [] as THREE.Vector3[] };
    }

    const originX = street.nodes[0].x;
    const originZ = street.nodes[0].z;

    const shape = new THREE.Shape();
    street.nodes.forEach((node, index) => {
      const lx = node.x - originX;
      // −lz: после rotateX(−π/2) получается мировое z, нормаль вверх
      const lz = -(node.z - originZ);
      if (index === 0) {
        shape.moveTo(lx, lz);
      } else {
        shape.lineTo(lx, lz);
      }
    });

    const geom = new THREE.ShapeGeometry(shape);
    geom.rotateX(-Math.PI / 2);

    const points = street.nodes.map(
      (node) =>
        new THREE.Vector3(node.x - originX, STREET_EDGE_Y, node.z - originZ),
    );
    points.push(points[0].clone());

    return {
      geometry: geom,
      origin: { x: originX, z: originZ },
      edgePoints: points,
    };
  }, [street.nodes]);

  if (!geometry || !origin) return null;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onStreetClick?.(street);
  };

  return (
    <group position={[origin.x, STREET_Y, origin.z]}>
      <mesh
        geometry={geometry}
        renderOrder={1}
        receiveShadow
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={UI_COLORS.STREET}
          roughness={0.92}
          metalness={0}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
      {edgePoints.length > 1 && (
        <Line
          points={edgePoints}
          color={UI_COLORS.STREET_EDGE}
          lineWidth={STREET_EDGE_WIDTH}
          toneMapped={false}
          depthWrite={false}
          renderOrder={2}
        />
      )}
    </group>
  );
};

/**
 * Отдельный mesh на сегмент — нужен клик по конкретной улице.
 * depthWrite=false: перекрытия одного цвета не мерцают.
 */
export const StreetsLayer = ({ streets, onStreetClick }: Props) => {
  return (
    <MapItems
      items={streets}
      render={(street) => (
        <StreetMesh
          key={street.id}
          street={street}
          onStreetClick={onStreetClick}
        />
      )}
    />
  );
};
