// Model transformation utilities for 3D model alignment
// Based on alignment scenarios documentation

import { Building } from "../types/types";

// TODO: Define proper ModelData interface when available
export interface ModelData {
  id: string;
  geometry: any; // Three.js geometry
  metadata: {
    boundingBox?: BoundingBox;
    fileFormat: string;
    vertexCount: number;
  };
}

export interface BoundingBox {
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  size: [number, number, number];
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  isOrthographic: boolean;
  orthographicSize?: number;
}

export interface ModelTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

/**
 * Calculate bounding box for multiple building polygons
 * @param polygons Array of building polygons
 * @returns Combined bounding box
 */
export function calculatePolygonBoundingBox(polygons: Building[]): BoundingBox {
  if (!polygons.length) {
    return {
      min: [0, 0, 0],
      max: [0, 0, 0],
      center: [0, 0, 0],
      size: [0, 0, 0],
    };
  }

  // Extract all vertices from all polygons
  const allVertices: [number, number, number][] = [];

  polygons.forEach(polygon => {
    // TODO: Extract actual vertices from polygon geometry
    // For now, use position as center point
    const center = polygon.position || [0, 0, 0];
    // Create a simple bounding box around the center
    const size = 10; // Default building size
    allVertices.push(
      [center[0] - size/2, 0, center[2] - size/2],
      [center[0] + size/2, 0, center[2] + size/2]
    );
  });

  // Calculate min/max from all vertices
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];

  allVertices.forEach(vertex => {
    min[0] = Math.min(min[0], vertex[0]);
    min[1] = Math.min(min[1], vertex[1]);
    min[2] = Math.min(min[2], vertex[2]);
    max[0] = Math.max(max[0], vertex[0]);
    max[1] = Math.max(max[1], vertex[1]);
    max[2] = Math.max(max[2], vertex[2]);
  });

  const center: [number, number, number] = [
    (min[0] + max[0]) / 2,
    (min[1] + max[1]) / 2,
    (min[2] + max[2]) / 2,
  ];

  const size: [number, number, number] = [
    max[0] - min[0],
    max[1] - min[1],
    max[2] - min[2],
  ];

  return { min, max, center, size };
}

/**
 * Calculate bounding box for 3D model
 * @param model 3D model data
 * @returns Model bounding box
 */
export function calculateModelBoundingBox(model: ModelData): BoundingBox {
  // TODO: Extract actual bounding box from Three.js geometry
  // For now, return a default bounding box
  return {
    min: [-5, 0, -5],
    max: [5, 10, 5],
    center: [0, 5, 0],
    size: [10, 10, 10],
  };
}

/**
 * Calculate initial model position and scale to match polygons
 * @param polygonBBox Combined bounding box of selected polygons
 * @param modelBBox Bounding box of 3D model
 * @returns Initial transform data
 */
export function calculateInitialModelPosition(
  polygonBBox: BoundingBox,
  modelBBox: BoundingBox
): ModelTransform {
  // Position model over polygon center
  const position: [number, number, number] = [
    polygonBBox.center[0],
    0, // Ground level
    polygonBBox.center[2],
  ];

  // Calculate scale to match polygon footprint
  const polygonFootprintSize = Math.max(polygonBBox.size[0], polygonBBox.size[2]);
  const modelFootprintSize = Math.max(modelBBox.size[0], modelBBox.size[2]);

  const scaleFactor = polygonFootprintSize / modelFootprintSize;
  const scale: [number, number, number] = [
    scaleFactor,
    scaleFactor,
    scaleFactor,
  ];

  return {
    position,
    rotation: [0, 0, 0], // Initial rotation
    scale,
  };
}

/**
 * Calculate top camera position above model
 * @param modelCenter Center of the model
 * @param modelHeight Height of the model
 * @returns Top camera state
 */
export function calculateTopCameraPosition(
  modelCenter: [number, number, number],
  modelHeight: number = 20
): CameraState {
  return {
    position: [modelCenter[0], modelHeight, modelCenter[2]],
    target: [modelCenter[0], 0, modelCenter[2]], // Look at ground level
    fov: 60,
    isOrthographic: true,
    orthographicSize: Math.max(modelHeight * 1.5, 30), // Ensure good view coverage
  };
}

/**
 * Calculate perspective camera position around model
 * @param modelCenter Center of the model
 * @param distance Distance from model center
 * @returns Perspective camera state
 */
export function calculatePerspectiveCameraPosition(
  modelCenter: [number, number, number],
  distance: number = 30
): CameraState {
  return {
    position: [modelCenter[0], 1.8, modelCenter[2] - distance], // North of model at eye level
    target: modelCenter, // Always look at model center
    fov: 60,
    isOrthographic: false,
  };
}

/**
 * Calculate target for top camera based on camera position
 * @param cameraPosition Current camera position
 * @returns Target position (always at ground level)
 */
export function calculateTopCameraTarget(
  cameraPosition: [number, number, number]
): [number, number, number] {
  return [cameraPosition[0], 0, cameraPosition[2]];
}

/**
 * Calculate orbital camera position around model center
 * @param modelCenter Center of the model
 * @param angleRadians Angle around model in radians
 * @param distance Distance from model center
 * @param height Camera height
 * @returns Orbital camera position
 */
export function calculateOrbitalCameraPosition(
  modelCenter: [number, number, number],
  angleRadians: number,
  distance: number,
  height: number = 1.8
): [number, number, number] {
  return [
    modelCenter[0] + Math.sin(angleRadians) * distance,
    height,
    modelCenter[2] + Math.cos(angleRadians) * distance,
  ];
}
