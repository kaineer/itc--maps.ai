import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Street } from "@shared/model/streets-types";
import { UI_COLORS } from "@shared/config/constants";

interface Props {
  streets: Street[];
}

const STREET_Y = 0.12;

const streetGeometry = (street: Street, originX: number, originZ: number) => {
  if (!street.nodes || street.nodes.length < 3) return null;

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
  return geom;
};

/**
 * Один mesh на все улицы.
 * Перекрывающиеся сегменты иначе z-fight'ятся (здания — объёмные боксы, им это не грозит).
 * depthWrite=false: overlapping одного цвета не мерцают.
 */
export const StreetsLayer = ({ streets }: Props) => {
  const { geometry, origin } = useMemo(() => {
    if (!streets.length) {
      return { geometry: null, origin: null };
    }

    const firstNode = streets.find((s) => s.nodes?.length)?.nodes?.[0];
    if (!firstNode) {
      return { geometry: null, origin: null };
    }

    const originX = firstNode.x;
    const originZ = firstNode.z;

    const parts = streets
      .map((street) => streetGeometry(street, originX, originZ))
      .filter((g): g is THREE.ShapeGeometry => g != null);

    if (!parts.length) {
      return { geometry: null, origin: null };
    }

    const merged = mergeGeometries(parts, false);
    parts.forEach((part) => part.dispose());

    return {
      geometry: merged,
      origin: { x: originX, z: originZ },
    };
  }, [streets]);

  if (!geometry || !origin) return null;

  return (
    <mesh
      geometry={geometry}
      position={[origin.x, STREET_Y, origin.z]}
      renderOrder={1}
      receiveShadow
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
