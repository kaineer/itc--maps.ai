import { useMemo } from "react";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";
import type { Street } from "@shared/model/streets-types";
import { UI_COLORS } from "@shared/config/constants";
import { MapItems } from "@kit/utils/MapItems";

interface Props {
  streets: Street[];
  onStreetClick?: (street: Street) => void;
}

const STREET_Y = 0.12;

const StreetMesh = ({
  street,
  onStreetClick,
}: {
  street: Street;
  onStreetClick?: (street: Street) => void;
}) => {
  const { geometry, origin } = useMemo(() => {
    if (!street.nodes || street.nodes.length < 3) {
      return { geometry: null, origin: null };
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

    return {
      geometry: geom,
      origin: { x: originX, z: originZ },
    };
  }, [street.nodes]);

  if (!geometry || !origin) return null;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onStreetClick?.(street);
  };

  return (
    <mesh
      geometry={geometry}
      position={[origin.x, STREET_Y, origin.z]}
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
