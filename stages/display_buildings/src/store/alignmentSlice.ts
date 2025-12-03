import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ModelData,
  calculatePolygonBoundingBox,
  calculateModelBoundingBox,
  calculateInitialModelPosition,
  calculateTopCameraPosition,
  calculatePerspectiveCameraPosition,
} from "../utils/modelTransform";
import { Building, Scale } from "../types/types";
import {
  addPosition,
  subtractPosition,
  multiplyPosition,
  distanceBetween,
  normalizePosition,
  scaleToLength,
  directionTo,
} from "../components/shared/positionMath";
import { Vector3 } from "three";

export type WorldDirection = "north" | "south" | "east" | "west";

export type CameraView = "perspective" | "top";
const defaultCameraView = "top";

// Position step configuration
export const positionStepMin = 0.5;
export const positionStepMax = 20;
export const positionStepFactor = 1.5;

type ModelPosition = [number, number, number];

export interface CameraState {
  position: ModelPosition;
  target: ModelPosition;
  fov: number;
  cameraDistance?: number; // Distance from camera to target (for perspective camera)
  cameraHeightMode?: "eyeLevel" | "groundLevel"; // Camera height mode for perspective view
}

type ModelRotation = number;

// --- CONFIG

// Rotation step configuration
const rotationSteps = [1, 2, 5, 10, 15, 30, 60, 90] as const;
type RotationStep = (typeof rotationSteps)[number];

interface MovementFunction {
  (step: number, origin: ModelPosition): ModelPosition;
}

const movePosition: { [id in WorldDirection]: MovementFunction } = {
  north: (step, [x, y, z]) => [x, y, z - step],
  east: (step, [x, y, z]) => [x + step, y, z],
  south: (step, [x, y, z]) => [x, y, z + step],
  west: (step, [x, y, z]) => [x - step, y, z],
};

// Minimal size for bounding box
const minExtent = 1.0;

// /-- CONFIG

export interface AlignmentState {
  // Camera management
  currentCameraView: CameraView;
  cameraStates: Record<CameraView, CameraState>;

  // Alignment process state
  selectedPolygons: Building[];
  currentModel: ModelData | null;
  modelTransform: {
    position: ModelPosition;
    rotation: ModelRotation;
    scale: Scale;
  };

  // Alignment tools and settings
  snapToPolygon: boolean;
  showGrid: boolean;
  showAxes: boolean;

  // Step configuration
  positionStep: number; // meters (0.5 to 20, exponential 1.5x)

  rotationStep: number; // degrees
  rotationStepIndex: number; // index in rotationSteps
  scaleStep: number; // percentage (1% or 5%)

  // Process state
  isAligning: boolean;
  alignmentProgress: number;
}

// Default camera configurations
const defaultPerspectiveCamera: CameraState = {
  position: [10, 10, 10],
  target: [0, 0, 0],
  fov: 60,
  cameraDistance: 14.142, // sqrt(10^2 + 10^2) approximate initial distance
  cameraHeightMode: "eyeLevel",
};

const defaultTopCamera: CameraState = {
  position: [0, 50, 0],
  target: [0, 0, 0],
  fov: 60,
  cameraDistance: 50, // Height is the distance in top view
  cameraHeightMode: "eyeLevel",
};

const initialState: AlignmentState = {
  currentCameraView: "perspective",
  cameraStates: {
    perspective: defaultPerspectiveCamera,
    top: defaultTopCamera,
  },

  // Alignment process state
  selectedPolygons: [],
  currentModel: null,
  modelTransform: {
    position: [0, 0, 0],
    rotation: 0,
    scale: 1,
  },

  // Alignment tools and settings
  snapToPolygon: true,
  showGrid: true,
  showAxes: true,

  // Step configuration
  positionStep: 1, // meters

  // Most large rotation step
  rotationStepIndex: rotationSteps.length - 1,
  rotationStep: rotationSteps[rotationSteps.length - 1], // degrees

  // Scale toggles between 1 and 5
  scaleStep: 5, // percentage

  // Process state
  isAligning: false,
  alignmentProgress: 0,
};

export const alignmentSlice = createSlice({
  name: "alignment",
  initialState,
  reducers: {
    // Camera management
    setCameraView: (state, action: PayloadAction<CameraView>) => {
      const newView = action.payload;
      state.currentCameraView = newView;
    },

    updateCameraState: (
      state,
      action: PayloadAction<{
        view: CameraView;
        cameraState: Partial<CameraState>;
      }>,
    ) => {
      const { view, cameraState } = action.payload;
      state.cameraStates[view] = {
        ...state.cameraStates[view],
        ...cameraState,
      };
    },

    resetCamera: (state, action: PayloadAction<CameraView>) => {
      const view = action.payload;
      switch (view) {
        case "perspective":
          state.cameraStates[view] = defaultPerspectiveCamera;
          break;
        case "top":
          state.cameraStates[view] = defaultTopCamera;
          break;
      }
    },

    resetAllCameras: (state) => {
      state.cameraStates = {
        perspective: defaultPerspectiveCamera,
        top: defaultTopCamera,
      };
    },

    // Reset everything
    resetAlignment: () => initialState,

    // Model selection and polygon management
    selectModelForAlignment: (state, action: PayloadAction<ModelData>) => {
      state.currentModel = action.payload;
    },

    addPolygonForAlignment: (state, action: PayloadAction<Building>) => {
      state.selectedPolygons.push(action.payload);
    },

    resetAlignmentPolygons: (state) => {
      state.selectedPolygons = [];
    },

    // Alignment process control
    startAlignmentProcess: (state) => {
      // Check that polygons are added and model is selected with non-zero bounding box
      if (state.selectedPolygons.length === 0) {
        throw new Error("Cannot start alignment: no polygons selected");
      }

      if (!state.currentModel) {
        throw new Error("Cannot start alignment: no model selected");
      }

      // Calculate bounding boxes
      const polygonBBox = calculatePolygonBoundingBox(state.selectedPolygons);
      const modelBBox = calculateModelBoundingBox(state.currentModel);

      // Check if model has non-zero bounding box
      const modelSize = modelBBox.getSize(new Vector3());
      if (
        modelSize.x < minExtent &&
        modelSize.y < minExtent &&
        modelSize.z < minExtent
      ) {
        throw new Error("Cannot start alignment: model is too small");
      }

      // Calculate initial model position and scale
      const initialTransform = calculateInitialModelPosition(
        polygonBBox,
        modelBBox,
      );

      // Only update model transform if it hasn't been set yet (preserve user changes)
      if (
        state.modelTransform.position[0] === 0 &&
        state.modelTransform.position[1] === 0 &&
        state.modelTransform.position[2] === 0
      ) {
        state.modelTransform = {
          position: initialTransform.position,
          rotation: 0,
          scale: initialTransform.scale[0], // Use uniform scale from first axis
        };
      }

      // Calculate model center for camera positioning
      const modelCenter = new Vector3(...state.modelTransform.position);

      // Only set up cameras if they haven't been initialized yet
      // Check if cameras are at their default positions AND targets
      const isTopCameraDefault =
        state.cameraStates.top.position[0] === defaultTopCamera.position[0] &&
        state.cameraStates.top.position[1] === defaultTopCamera.position[1] &&
        state.cameraStates.top.position[2] === defaultTopCamera.position[2] &&
        state.cameraStates.top.target[0] === defaultTopCamera.target[0] &&
        state.cameraStates.top.target[1] === defaultTopCamera.target[1] &&
        state.cameraStates.top.target[2] === defaultTopCamera.target[2];

      const isPerspectiveCameraDefault =
        state.cameraStates.perspective.position[0] ===
          defaultPerspectiveCamera.position[0] &&
        state.cameraStates.perspective.position[1] ===
          defaultPerspectiveCamera.position[1] &&
        state.cameraStates.perspective.position[2] ===
          defaultPerspectiveCamera.position[2] &&
        state.cameraStates.perspective.target[0] ===
          defaultPerspectiveCamera.target[0] &&
        state.cameraStates.perspective.target[1] ===
          defaultPerspectiveCamera.target[1] &&
        state.cameraStates.perspective.target[2] ===
          defaultPerspectiveCamera.target[2];

      if (isTopCameraDefault) {
        state.cameraStates.top = calculateTopCameraPosition(
          modelCenter,
          modelBBox,
          polygonBBox,
        );
        // Top camera initialized
      }

      if (isPerspectiveCameraDefault) {
        const newCamera = calculatePerspectiveCameraPosition(
          modelCenter,
          modelBBox,
        );

        state.cameraStates.perspective = newCamera;
        // Perspective camera initialized
      }

      // Start the alignment process
      state.isAligning = true;
      state.alignmentProgress = 0;
    },

    // Model transformation actions
    moveModelInDirection: (state, action: PayloadAction<WorldDirection>) => {
      const direction = action.payload;
      state.modelTransform.position = movePosition[direction](
        state.positionStep,
        state.modelTransform.position,
      );

      // Update perspective camera target to follow model
      const cameraState = state.cameraStates.perspective;
      const oldTarget = [...cameraState.target] as ModelPosition;
      cameraState.target = state.modelTransform.position;

      // Also update camera position to maintain same relative position
      const offset = subtractPosition(cameraState.position, oldTarget);
      cameraState.position = addPosition(state.modelTransform.position, offset);

      // Recalculate camera distance
      if (cameraState.cameraDistance) {
        cameraState.cameraDistance = distanceBetween(
          state.modelTransform.position,
          cameraState.position,
        );
      }
    },

    updateModelPosition: (
      state,
      action: PayloadAction<{ position: ModelPosition }>,
    ) => {
      state.modelTransform.position = action.payload.position;

      // Update perspective camera target to follow model
      const cameraState = state.cameraStates.perspective;
      const oldTarget = [...cameraState.target] as ModelPosition;
      cameraState.target = state.modelTransform.position;

      // Also update camera position to maintain same relative position
      const offset = subtractPosition(cameraState.position, oldTarget);
      cameraState.position = addPosition(state.modelTransform.position, offset);

      // Recalculate camera distance
      if (cameraState.cameraDistance) {
        cameraState.cameraDistance = distanceBetween(
          state.modelTransform.position,
          cameraState.position,
        );
      }
    },

    // Update camera target to follow model position and maintain camera position
    updateCameraTarget: (
      state,
      action: PayloadAction<{ view: CameraView; target: ModelPosition }>,
    ) => {
      const { view, target } = action.payload;
      const cameraState = state.cameraStates[view];

      // Save old target before updating
      const oldTarget = [...cameraState.target] as ModelPosition;

      // Calculate the offset from old target to camera
      const offset = subtractPosition(cameraState.position, oldTarget);

      // Update target
      cameraState.target = target;

      // Update camera position to maintain same offset from new target
      cameraState.position = addPosition(target, offset);

      // Recalculate camera distance for perspective camera
      if (view === "perspective" && cameraState.cameraDistance) {
        cameraState.cameraDistance = distanceBetween(
          target,
          cameraState.position,
        );
      }
    },

    moveTopCameraInDirection: (
      state,
      action: PayloadAction<WorldDirection>,
    ) => {
      const direction = action.payload;
      state.cameraStates.top.position = movePosition[direction](
        state.positionStep,
        state.cameraStates.top.position,
      );
    },

    updateTopCameraPosition: (
      state,
      action: PayloadAction<{ position: ModelPosition }>,
    ) => {
      state.cameraStates.top.position = action.payload.position;
    },

    increasePositionStep: (state) => {
      state.positionStep = Math.min(
        positionStepMax,
        state.positionStep * positionStepFactor,
      );
    },

    decreasePositionStep: (state) => {
      state.positionStep = Math.max(
        positionStepMin,
        state.positionStep / positionStepFactor,
      );
    },

    rotateModelAroundY: (
      state,
      action: PayloadAction<"clockwise" | "counterclockwise">,
    ) => {
      const direction = action.payload;
      if (direction === "clockwise") {
        state.modelTransform.rotation -= state.rotationStep;
      } else {
        state.modelTransform.rotation += state.rotationStep;
      }
    },

    increaseRotationStep: (state) => {
      if (state.rotationStepIndex < rotationSteps.length - 1) {
        state.rotationStepIndex += 1;
        state.rotationStep = rotationSteps[state.rotationStepIndex];
      }
    },

    decreaseRotationStep: (state) => {
      if (state.rotationStepIndex > 0) {
        state.rotationStepIndex -= 1;
        state.rotationStep = rotationSteps[state.rotationStepIndex];
      }
    },

    // Scale transformation actions
    increaseModelScale: (state) => {
      state.modelTransform.scale =
        state.modelTransform.scale * 1 + state.scaleStep / 100;
    },

    decreaseModelScale: (state) => {
      state.modelTransform.scale =
        state.modelTransform.scale * 1 - state.scaleStep / 100;
    },

    // Scale step toggle (1% or 5%)
    toggleScaleStep: (state) => {
      if (state.scaleStep < 2) {
        // 1
        state.scaleStep = 5;
      } else {
        state.scaleStep = 1;
      }
    },

    // Perspective camera distance actions
    increaseCameraDistance: (state) => {
      const cameraState = state.cameraStates.perspective;
      if (cameraState.cameraDistance) {
        // Increase distance by position step
        cameraState.cameraDistance += state.positionStep;
        // Update camera position based on new distance
        updateCameraPositionFromDistance(cameraState);
      }
    },

    decreaseCameraDistance: (state) => {
      const cameraState = state.cameraStates.perspective;
      if (cameraState.cameraDistance) {
        // Decrease distance by position step, but don't go below minimum
        const minDistance = 1.0; // Minimum distance to avoid camera inside model
        cameraState.cameraDistance = Math.max(
          minDistance,
          cameraState.cameraDistance - state.positionStep,
        );
        // Update camera position based on new distance
        updateCameraPositionFromDistance(cameraState);
      }
    },

    // Update camera position based on current distance and target
    updateCameraPositionFromDistance: (
      state,
      action: PayloadAction<{ view: CameraView }>,
    ) => {
      const view = action.payload.view;
      const cameraState = state.cameraStates[view];

      if (cameraState.cameraDistance && view === "perspective") {
        // Calculate direction vector from target to current position
        const direction = directionTo(cameraState.target, cameraState.position);

        // Calculate current distance (should match cameraDistance)
        const currentDistance = distanceBetween(
          cameraState.target,
          cameraState.position,
        );

        if (currentDistance > 0) {
          // Scale direction vector to match desired distance
          const scaledDirection = scaleToLength(
            direction,
            cameraState.cameraDistance,
          );

          // Update camera position
          cameraState.position = addPosition(
            cameraState.target,
            scaledDirection,
          );
        }
      }
    },

    // Update camera orbit (rotate around target while maintaining distance and height)
    rotateCameraAroundTarget: (
      state,
      action: PayloadAction<{
        view: CameraView;
        horizontalAngle: number;
        verticalAngle: number;
      }>,
    ) => {
      const { view, horizontalAngle, verticalAngle } = action.payload;
      const cameraState = state.cameraStates[view];

      if (cameraState.cameraDistance && view === "perspective") {
        // Calculate current direction vector from target to camera
        const direction = directionTo(cameraState.target, cameraState.position);
        const [dx, dy, dz] = direction;

        // Calculate current horizontal distance (projection on XZ plane for Y-up system)
        const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

        if (horizontalDistance > 0) {
          // Calculate current horizontal angle in XZ plane
          const currentAngle = Math.atan2(dz, dx);

          // Apply horizontal rotation (around Y axis)
          const newAngle = currentAngle + (horizontalAngle * Math.PI) / 180;

          // Calculate new X and Z coordinates (horizontal plane)
          const newX = horizontalDistance * Math.cos(newAngle);
          const newZ = horizontalDistance * Math.sin(newAngle);

          // Apply vertical rotation (if any) - around horizontal axis
          // In Y-up system, vertical angle is relative to XZ plane
          const currentVerticalAngle = Math.atan2(dy, horizontalDistance);
          const newVerticalAngle =
            currentVerticalAngle + (verticalAngle * Math.PI) / 180;
          const newY = horizontalDistance * Math.tan(newVerticalAngle);

          // Update camera position relative to target
          cameraState.position = [
            cameraState.target[0] + newX,
            cameraState.target[1] + newY,
            cameraState.target[2] + newZ,
          ];

          // Recalculate actual distance after rotation
          cameraState.cameraDistance = distanceBetween(
            cameraState.target,
            cameraState.position,
          );
        }
      }
    },

    // Toggle camera height between eye level and ground level
    toggleCameraHeight: (state) => {
      const cameraState = state.cameraStates.perspective;

      // Define height values
      const EYE_LEVEL_HEIGHT = 1.8; // 1.8 meters - human eye level
      const GROUND_LEVEL_HEIGHT = 0.05; // 0.5 meters - slightly above ground

      // Toggle between modes
      if (cameraState.cameraHeightMode === "groundLevel") {
        // Switch to eye level
        cameraState.cameraHeightMode = "eyeLevel";

        // Calculate direction vector from target to current position
        const direction = directionTo(cameraState.target, cameraState.position);
        const [dx, dy, dz] = direction;

        // Calculate current horizontal distance
        const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

        if (horizontalDistance > 0) {
          // Calculate current horizontal angle
          const currentAngle = Math.atan2(dz, dx);

          // Calculate new position at eye level height
          const newX = horizontalDistance * Math.cos(currentAngle);
          const newZ = horizontalDistance * Math.sin(currentAngle);

          // Update camera position (keep same horizontal position, change height)
          cameraState.position = [
            cameraState.target[0] + newX,
            cameraState.target[1] + EYE_LEVEL_HEIGHT,
            cameraState.target[2] + newZ,
          ];
        }
      } else {
        // Switch to ground level (default to eye level if undefined)
        cameraState.cameraHeightMode = "groundLevel";

        // Calculate direction vector from target to current position
        const direction = directionTo(cameraState.target, cameraState.position);
        const [dx, dy, dz] = direction;

        // Calculate current horizontal distance
        const horizontalDistance = Math.sqrt(dx * dx + dz * dz);

        if (horizontalDistance > 0) {
          // Calculate current horizontal angle
          const currentAngle = Math.atan2(dz, dx);

          // Calculate new position at ground level height
          const newX = horizontalDistance * Math.cos(currentAngle);
          const newZ = horizontalDistance * Math.sin(currentAngle);

          // Update camera position (keep same horizontal position, change height)
          cameraState.position = [
            cameraState.target[0] + newX,
            cameraState.target[1] + GROUND_LEVEL_HEIGHT,
            cameraState.target[2] + newZ,
          ];
        }
      }

      // Recalculate camera distance after height change
      cameraState.cameraDistance = distanceBetween(
        cameraState.target,
        cameraState.position,
      );
    },
  },

  selectors: {
    getCurrentCamera: (state) => state.cameraStates[state.currentCameraView],
    getCurrentCameraView: (state) => state.currentCameraView,

    // Camera state selectors
    getTopCameraState: (state) => state.cameraStates.top,
    getPerspectiveCameraState: (state) => state.cameraStates.perspective,

    // Model and polygon selectors
    getSelectedModel: (state) => state.currentModel,
    getSelectedPolygons: (state) => state.selectedPolygons,
    getModelTransform: (state) => state.modelTransform,

    // Alignment tools selectors
    getAlignmentTools: (state) => ({
      snapToPolygon: state.snapToPolygon,
      showGrid: state.showGrid,
      showAxes: state.showAxes,
    }),

    // Step configuration selectors
    getPositionStep: (state) => state.positionStep,
    getRotationStep: (state): RotationStep =>
      rotationSteps[state.rotationStepIndex],
    getScaleStep: (state) => state.scaleStep,

    // Camera distance selector
    getCameraDistance: (state) => (view: CameraView) => {
      return state.cameraStates[view].cameraDistance;
    },

    // Process state selectors
    getAlignmentProgress: (state) => ({
      isAligning: state.isAligning,
      progress: state.alignmentProgress,
    }),
  },
});

// Helper function to update camera position based on distance
function updateCameraPositionFromDistance(cameraState: CameraState) {
  if (!cameraState.cameraDistance) return;

  // Calculate direction vector from target to current position
  const direction = directionTo(cameraState.target, cameraState.position);

  // Calculate current distance
  const currentDistance = distanceBetween(
    cameraState.target,
    cameraState.position,
  );

  if (currentDistance > 0) {
    // Scale direction vector to match desired distance
    const scaledDirection = scaleToLength(
      direction,
      cameraState.cameraDistance,
    );

    // Update camera position
    cameraState.position = addPosition(cameraState.target, scaledDirection);
  }
}
