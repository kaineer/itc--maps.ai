// Model transformation utilities for 3D model alignment
// Based on alignment scenarios documentation
import { Box3, Vector3 } from "three";

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

// Use Three.js Box3 for bounding box calculations
// Box3 provides: min (Vector3), max (Vector3), and methods like getCenter(), getSize()

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
export function calculatePolygonBoundingBox(polygons: Building[]): Box3 {
  const bbox = new Box3();

  if (!polygons.length) {
    return bbox;
  }

  // Extract all vertices from all polygons and expand the Box3
  polygons.forEach((polygon) => {
    // TODO: Extract actual vertices from polygon geometry
    // For now, use position as center point
    const center = polygon.position || [0, 0, 0];
    // Create a simple bounding box around the center
    const size = 10; // Default building size

    const minPoint = new Vector3(center[0] - size / 2, 0, center[2] - size / 2);
    const maxPoint = new Vector3(
      center[0] + size / 2,
      10, // Default building height
      center[2] + size / 2,
    );

    bbox.expandByPoint(minPoint);
    bbox.expandByPoint(maxPoint);
  });

  return bbox;
}

/**
 * Calculate bounding box for 3D model
 * @param model 3D model data
 * @returns Model bounding box
 */
export function calculateModelBoundingBox(model: ModelData): Box3 {
  // TODO: Extract actual bounding box from Three.js geometry
  // For now, return a default bounding box
  return new Box3(new Vector3(-5, 0, -5), new Vector3(5, 10, 5));
}

/**
 * Calculate initial model position and scale to match polygons
 * @param polygonBBox Combined bounding box of selected polygons
 * @param modelBBox Bounding box of 3D model
 * @returns Initial transform data
 */
export function calculateInitialModelPosition(
  polygonBBox: Box3,
  modelBBox: Box3,
): ModelTransform {
  // Position model over polygon center
  const polygonCenter = new Vector3();
  polygonBBox.getCenter(polygonCenter);

  const position: [number, number, number] = [
    polygonCenter.x,
    0, // Ground level
    polygonCenter.z,
  ];

  // Calculate scale to match polygon footprint
  const polygonSize = new Vector3();
  polygonBBox.getSize(polygonSize);
  const modelSize = new Vector3();
  modelBBox.getSize(modelSize);

  const polygonFootprintSize = Math.max(polygonSize.x, polygonSize.z);
  const modelFootprintSize = Math.max(modelSize.x, modelSize.z);

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
  modelHeight: number = 20,
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
  distance: number = 30,
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
  cameraPosition: [number, number, number],
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
  height: number = 1.8,
): [number, number, number] {
  return [
    modelCenter[0] + Math.sin(angleRadians) * distance,
    height,
    modelCenter[2] + Math.cos(angleRadians) * distance,
  ];
}
