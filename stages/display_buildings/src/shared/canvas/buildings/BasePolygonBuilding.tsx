import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { Building } from "@shared/model/buildings-types";
import { ThreeEvent } from "@react-three/fiber";
import { UI_COLORS } from "@shared/config/constants";

type OnClickFunction = (building: Building) => void;

interface Props {
  building: Building;
  opacity?: number;
  highlighted?: boolean;
  onClick?: OnClickFunction;
}

const EDGE_LINE_WIDTH = 2;
/** Tiny lift along extrusion axis only — no footprint outset (outset leaks behind neighbors). */
const EDGE_Z_EPS = 0.01;

const handleClick =
  (onClick: OnClickFunction, building: Building) =>
  (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onClick(building);

    const { id, address, position, height, nodes } = building;
    console.log({ id, address, position, height, nodes });
  };

interface Footprint {
  shape: THREE.Shape;
  /** Local shape-space points (XY), centroid at origin. */
  localPoints: Array<[number, number]>;
  originX: number;
  originZ: number;
}

const buildLocalFootprint = (nodes: Building["nodes"]): Footprint | null => {
  if (!nodes || nodes.length < 2) return null;

  const points: Array<[number, number]> = [];
  for (const node of nodes) {
    if (node.x === undefined || node.z === undefined) continue;
    points.push([node.x, node.z]);
  }

  if (
    points.length > 2 &&
    Math.abs(points[0][0] - points[points.length - 1][0]) < 1e-6 &&
    Math.abs(points[0][1] - points[points.length - 1][1]) < 1e-6
  ) {
    points.pop();
  }
  if (points.length < 3) return null;

  let originX = 0;
  let originZ = 0;
  for (const [x, z] of points) {
    originX += x;
    originZ += z;
  }
  originX /= points.length;
  originZ /= points.length;

  // Shape in XY; after rotateX(-π/2), local Y becomes world -Z → use -(z - originZ)
  const localPoints: Array<[number, number]> = points.map(([x, z]) => [
    x - originX,
    -(z - originZ),
  ]);

  const shape = new THREE.Shape();
  shape.moveTo(localPoints[0][0], localPoints[0][1]);
  for (let i = 1; i < localPoints.length; i++) {
    shape.lineTo(localPoints[i][0], localPoints[i][1]);
  }
  shape.closePath();

  return { shape, localPoints, originX, originZ };
};

const edgeKey = (a: number, b: number) =>
  a < b ? `${a},${b}` : `${b},${a}`;

const pushSegment = (
  out: THREE.Vector3[],
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
) => {
  out.push(new THREE.Vector3(x0, y0, z0), new THREE.Vector3(x1, y1, z1));
};

/**
 * Outer cage (top/bottom/verticals) plus internal roof triangulation edges.
 * Coordinates are in extrude local space (XY footprint, Z up the extrusion).
 */
const buildEdgePoints = (
  localPoints: Array<[number, number]>,
  height: number,
): THREE.Vector3[] => {
  const n = localPoints.length;
  const z0 = EDGE_Z_EPS;
  const z1 = height + EDGE_Z_EPS;
  const out: THREE.Vector3[] = [];

  for (let i = 0; i < n; i++) {
    const [x0, y0] = localPoints[i];
    const [x1, y1] = localPoints[(i + 1) % n];
    pushSegment(out, x0, y0, z0, x1, y1, z0);
    pushSegment(out, x0, y0, z1, x1, y1, z1);
    pushSegment(out, x0, y0, z0, x0, y0, z1);
  }

  // Internal edges on roof only (bottom internals stay under the ground/roads)
  const contour = localPoints.map(([x, y]) => new THREE.Vector2(x, y));
  let tris: number[][];
  try {
    tris = THREE.ShapeUtils.triangulateShape(contour, []);
  } catch {
    return out;
  }

  const boundary = new Set<string>();
  for (let i = 0; i < n; i++) {
    boundary.add(edgeKey(i, (i + 1) % n));
  }

  for (const tri of tris) {
    for (let e = 0; e < 3; e++) {
      const a = tri[e];
      const b = tri[(e + 1) % 3];
      if (boundary.has(edgeKey(a, b))) continue;
      const [x0, y0] = localPoints[a];
      const [x1, y1] = localPoints[b];
      pushSegment(out, x0, y0, z1, x1, y1, z1);
    }
  }

  return out;
};

export const BasePolygonBuilding = ({
  building,
  highlighted = false,
  opacity = 1.0,
  onClick = () => null,
}: Props) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const height = building.height || 3;

  const footprint = useMemo(
    () => buildLocalFootprint(building.nodes),
    [building.nodes],
  );

  const edgePoints = useMemo(
    () =>
      footprint ? buildEdgePoints(footprint.localPoints, height) : [],
    [footprint, height],
  );

  const color = highlighted
    ? UI_COLORS.HIGHLIGHTED
    : building.address
      ? UI_COLORS.BUILDING
      : UI_COLORS.ANONYMOUS;

  if (!footprint) {
    return null;
  }

  const opaque = opacity >= 0.99;

  return (
    <group
      position={[footprint.originX, 0, footprint.originZ]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={handleClick(onClick, building)}
      >
        <extrudeGeometry
          args={[footprint.shape, { depth: height, bevelEnabled: false }]}
        />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.2}
          transparent={!opaque}
          opacity={opacity}
          depthWrite
          depthTest
        />
      </mesh>
      {edgePoints.length > 0 && (
        <Line
          points={edgePoints}
          segments
          lineWidth={EDGE_LINE_WIDTH}
          color={UI_COLORS.BUILDING_EDGE}
          toneMapped={false}
          transparent={!opaque}
          opacity={opacity}
          depthTest
          depthWrite
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      )}
    </group>
  );
};
