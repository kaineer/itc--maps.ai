import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelData } from "../utils/modelTransform";
import { Building, Scale } from "../types/types";

export type CameraView = "perspective" | "top";

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

type ModelRotation = number;

// --- CONFIG

// Rotation step configuration
const rotationSteps = [1, 2, 5, 10, 15, 30, 60, 90] as const;
type RotationStep = (typeof rotationSteps)[number];

// Movement step configuration
const positionStepMin = 0.5;
const positionStepMax = 20;
const positionStepFactor = 1.5;

// /-- CONFIG

export interface AlignmentState {
  // Camera management
  currentCameraView: CameraView;
  cameraStates: Record<CameraView, CameraState>;

  // Alignment process state
  selectedPolygons: Building[];
  currentModel: ModelData | null;
  modelTransform: {
    position: [number, number, number];
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
};

const defaultTopCamera: CameraState = {
  position: [0, 20, 0],
  target: [0, 0, 0],
  fov: 60,
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
      state.currentCameraView = action.payload;
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
      // TODO: Implement model selection logic
    },

    addPolygonForAlignment: (state, action: PayloadAction<Building>) => {
      // TODO: Implement polygon addition logic
    },

    resetAlignmentPolygons: (state) => {
      // TODO: Implement polygon reset logic
    },

    // Alignment process control
    startAlignmentProcess: (state) => {
      // TODO: Check that polygons are added and model is selected with non-zero bounding box
      // TODO: Implement alignment process start logic
    },

    // Model transformation actions
    moveModelInDirection: (
      state,
      action: PayloadAction<"north" | "south" | "east" | "west">,
    ) => {
      // TODO: Implement model movement in specified direction using positionStep
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
  },

  selectors: {
    getCurrentCamera: (state) => state.cameraStates[state.currentCameraView],
    getCurrentCameraView: (state) => state.currentCameraView,

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
    getRotationStep: (state): RotationStep =>
      rotationSteps[state.rotationStepIndex],
    getScaleStep: (state) => state.scaleStep,

    // Process state selectors
    getAlignmentProgress: (state) => ({
      isAligning: state.isAligning,
      progress: state.alignmentProgress,
    }),
  },
});
