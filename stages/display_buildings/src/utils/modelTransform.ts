// Model transformation utilities for 3D model alignment
// Based on alignment scenarios documentation
import { Box3, Vector3 } from "three";

// Constants
import { CAMERA_HEIGHTS /* , MODEL_CONSTANTS*/ } from "./constants";

import { Building, BuildingNode } from "../types/types";
import { CameraState, ModelPosition } from "../store/slices/alignmentSlice";

const defaultPolygonSize = 10;

// Model data loaded via useFBX() from @react-three/drei
export interface ModelData {
  id: string;
  // The loaded model object from useFBX() - typically a Group containing meshes
  modelObject: any; // Three.js Group or Object3D
  metadata: {
    fileFormat: string;
    vertexCount: number;
    boundingBox?: Box3; // Can be pre-calculated and cached
  };
}

// type SerializableModelData = Omit<ModelData, "modelObject" | "metadata">;

// Use Three.js Box3 for bounding box calculations
// Box3 provides: min (Vector3), max (Vector3), and methods like getCenter(), getSize()

export interface ModelTransform {
  position: ModelPosition;
  rotation: number; // Rotation around Y axis in degrees
  scale: number; // Uniform scale factor
  yOffset?: number; // Optional Y offset for ground level placement
}

const calculatePositionedPolygonBBox = (polygon: Building): Box3 => {
  const center = polygon.position || { x: 0, z: 0 };

  const size = defaultPolygonSize;

  const polygonBBox = new Box3(
    new Vector3(center.x - size / 2, 0, center.z - size / 2),
    new Vector3(center.x + size / 2, 10, center.z + size / 2),
  );

  return polygonBBox;
};

const calculateFreePolygonBBox = (polygon: Building): Box3 => {
  const polygonBBox = new Box3();

  polygon.nodes.forEach((node: BuildingNode) => {
    const point = new Vector3(node.x, 0, node.z);
    polygonBBox.expandByPoint(point);
  });

  const polygonHeight = polygon.height || 10;

  const min = polygonBBox.min.clone();
  const max = polygonBBox.max.clone();
  max.y = polygonHeight;
  polygonBBox.set(min, max);

  return polygonBBox;
};

/**
 * Calculate bounding box for multiple building polygons
 * @param polygons Array of building polygons
 * @returns Combined bounding box
 */
export function calculatePolygonsBoundingBox(polygons: Building[]): Box3 {
  const bbox = new Box3();

  if (!polygons.length) {
    return bbox;
  }

  // Calculate individual bounding boxes for each polygon and union them
  polygons.forEach((polygon) => {
    const polygonBBox = polygon.position
      ? calculatePositionedPolygonBBox(polygon)
      : calculateFreePolygonBBox(polygon);

    // Union this polygon's bounding box with the combined bounding box
    bbox.union(polygonBBox);
  });

  return bbox;
}

/**
 * Calculate bounding box for 3D model
 * @param model 3D model data
 * @returns Model bounding box
 */
export function calculateModelBoundingBox(model: ModelData): Box3 {
  if (model.modelObject) {
    // Use Three.js setFromObject to calculate bounding box from the loaded model
    const bbox = new Box3().setFromObject(model.modelObject);
    return bbox;
  }

  // Fallback: return a default bounding box
  return new Box3(new Vector3(-5, 0, -5), new Vector3(5, 10, 5));
}

/**
 * Calculate initial model position and scale to match polygons
 * @param polygonBBox Combined bounding box of selected polygons
 * @param modelBBox Bounding box of 3D model
 * @param targetSize Target size for the model (default: 20)
 * @returns Initial transform data with position, scale, and Y offset
 */
export function calculateInitialModelPosition(
  polygonBBox: Box3,
  modelBBox: Box3,
  targetSize: number = 20,
): ModelTransform & { yOffset: number } {
  // Position model over polygon center
  const polygonCenter = new Vector3();
  polygonBBox.getCenter(polygonCenter);

  // Calculate scale based on model bounding box (like DebugModelBuilding)
  const modelSize = modelBBox.getSize(new Vector3());
  const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
  const calculatedScale = targetSize / maxDimension;

  // Calculate Y offset to place bottom of model at ground level (y=0)
  const minY = modelBBox.min.y * calculatedScale;
  const yOffset = -minY;

  const position: ModelPosition = [
    polygonCenter.x,
    yOffset, // Adjusted for ground level placement
    polygonCenter.z,
  ];

  return {
    position,
    rotation: 0, // Initial rotation around Y axis
    scale: calculatedScale,
    yOffset,
  };
}

/**
 * Calculate model scale to match polygon footprint (alternative approach)
 * @param polygonBBox Combined bounding box of selected polygons
 * @param modelBBox Bounding box of 3D model
 * @returns Scale factor to match model footprint to polygon footprint
 */
export function calculateModelScaleToPolygons(
  polygonBBox: Box3,
  modelBBox: Box3,
): number {
  // Calculate scale to match polygon footprint
  const polygonSize = new Vector3();
  polygonBBox.getSize(polygonSize);
  const modelSize = new Vector3();
  modelBBox.getSize(modelSize);

  const polygonFootprintSize = Math.max(polygonSize.x, polygonSize.z);
  const modelFootprintSize = Math.max(modelSize.x, modelSize.z);

  return polygonFootprintSize / modelFootprintSize;
}

/**
 * Calculate top camera position above model
 * @param modelCenter Center of the model
 * @param modelBBox Bounding box of the model
 * @returns Top camera state
 */
export function calculateTopCameraPosition(
  modelCenter: Vector3,
  modelBBox: Box3,
  polygonBBox?: Box3,
): CameraState {
  // Get model size from bounding box
  const modelSize = new Vector3();
  modelBBox.getSize(modelSize);

  // Calculate base height from model
  let maxHeight = modelSize.y;

  // If polygon bounding box is provided, consider its height as well
  if (polygonBBox) {
    const polygonSize = new Vector3();
    polygonBBox.getSize(polygonSize);
    maxHeight = Math.max(maxHeight, polygonSize.y);
  }

  // Calculate camera height: 10 times the maximum height (model or polygons)
  const cameraHeight = maxHeight * 10;

  // Ensure minimum camera height for visibility
  const minCameraHeight = 20;
  const finalCameraHeight = Math.max(cameraHeight, minCameraHeight);

  // Position camera directly above model center
  const position: ModelPosition = [
    modelCenter.x,
    finalCameraHeight,
    modelCenter.z,
  ];

  // Target is the center of the model (looking straight down)
  const target: ModelPosition = [modelCenter.x, 0, modelCenter.z];

  return {
    position,
    target,
    fov: 60,
  };
}

/**
 * Calculate perspective camera position around model
 * @param modelCenter Center of the model
 * @param modelBBox Bounding box of the model
 * @returns Perspective camera state
 */
export function calculatePerspectiveCameraPosition(
  modelCenter: Vector3,
  modelBBox: Box3,
): CameraState {
  // Get model size from bounding box
  const modelSize = new Vector3();
  modelBBox.getSize(modelSize);

  // Take maximum of width and length, multiply by 1.5
  const maxHorizontalSize = Math.max(modelSize.x, modelSize.z);
  // const distance = maxHorizontalSize * 1.5;
  const distance = maxHorizontalSize * 3;

  // Position camera north of model, elevated to see entire model
  // Use model height plus some extra clearance
  const cameraHeight = CAMERA_HEIGHTS.EYE_LEVEL;
  const position: ModelPosition = [
    modelCenter.x,
    cameraHeight,
    modelCenter.z - distance, // North of model
  ];

  // Target is slightly above the base of the model for better viewing angle
  const targetHeight = CAMERA_HEIGHTS.EYE_LEVEL;
  const target: ModelPosition = [modelCenter.x, targetHeight, modelCenter.z];

  // Calculate distance from camera to target
  // const cameraDistance = Math.sqrt(
  //   Math.pow(position[0] - target[0], 2) +
  //     Math.pow(position[1] - target[1], 2) +
  //     Math.pow(position[2] - target[2], 2),
  // );

  return {
    position,
    target,
    fov: 60,
    cameraDistance: distance,
  };
}

/**
 * Calculate target for top camera based on camera position
 * @param cameraPosition Current camera position
 * @returns Target position (always at ground level)
 */
export function calculateTopCameraTarget(
  cameraPosition: ModelPosition,
): ModelPosition {
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
  modelCenter: Vector3,
  angleRadians: number,
  distance: number,
  height: number = CAMERA_HEIGHTS.EYE_LEVEL,
): ModelPosition {
  return [
    modelCenter.x + Math.sin(angleRadians) * distance,
    height,
    modelCenter.z + Math.cos(angleRadians) * distance,
  ];
}

/**
 * Calculate world bbox for model
 *
 * NOTE: this one DOES NOT concerns of model rotation
 *
 * @param modelBBox Bounding box of model
 * @param scale Scalar for model scale
 * @param position Model position near polygons
 * @returns Another bounding box near polygons
 */
export function calculateWorldBBox(
  modelBBox: Box3,
  scale: number,
  position: ModelPosition,
) {
  const worldModelBBox = modelBBox.clone();

  const vScale = new Vector3(scale, scale, scale);
  const vPosition = new Vector3(...position);

  worldModelBBox.min.multiply(vScale);
  worldModelBBox.max.multiply(vScale);

  worldModelBBox.min.add(vPosition);
  worldModelBBox.max.add(vPosition);

  return worldModelBBox;
}
