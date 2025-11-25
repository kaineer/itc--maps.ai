import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelData } from "../utils/modelTransform";
import { Building } from "../types/types";

export type CameraView = "perspective" | "top";

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// TODO: Define proper interfaces based on alignment scenarios
// interface AlignmentState {
//   // Camera management
//   currentCameraView: CameraView;
//   cameraStates: Record<CameraView, CameraState>;
//
//   // Model transformation
//   selectedModelId: string | null;
//   modelPosition: [number, number, number];
//   modelRotation: [number, number, number];
//   modelScale: [number, number, number];
//
//   // Alignment tools
//   snapToPolygon: boolean;
//   showGrid: boolean;
//   showAxes: boolean;
//
//   // Temporary alignment data
//   isAligning: boolean;
//   alignmentProgress: number;
// }

export interface AlignmentState {
  // Camera management
  currentCameraView: CameraView;
  cameraStates: Record<CameraView, CameraState>;

  // Alignment process state
  selectedPolygons: Building[];
  currentModel: ModelData | null;
  modelTransform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };

  // Alignment tools and settings
  snapToPolygon: boolean;
  showGrid: boolean;
  showAxes: boolean;

  // Step configuration
  positionStep: number; // meters (0.5 to 20, exponential 1.5x)
  rotationStep: number; // degrees (1 to 90, grid: 1, 2, 5, 10, 15, 30, 60, 90)
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
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },

  // Alignment tools and settings
  snapToPolygon: true,
  showGrid: true,
  showAxes: true,

  // Step configuration
  positionStep: 1, // meters
  rotationStep: 15, // degrees
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

    // TODO: Implement model and transformation actions based on scenarios
    // selectModelAndPolygons: (state, action: PayloadAction<{ model: ModelData; polygons: Polygon[] }>) => {
    //   state.currentModel = action.payload.model;
    //   state.selectedPolygons = action.payload.polygons;
    //   // TODO: Calculate automatic positioning
    // },
    //
    // setModelTransform: (state, action: PayloadAction<Partial<ModelTransform>>) => {
    //   state.modelTransform = { ...state.modelTransform, ...action.payload };
    // },
    //
    // // Alignment tools
    // toggleSnapToPolygon: (state) => {
    //   state.snapToPolygon = !state.snapToPolygon;
    // },
    //
    // toggleGrid: (state) => {
    //   state.showGrid = !state.showGrid;
    // },
    //
    // toggleAxes: (state) => {
    //   state.showAxes = !state.showAxes;
    // },
    // },

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
      // TODO: Implement position step increase (exponential 1.5x, max 20m)
    },

    decreasePositionStep: (state) => {
      // TODO: Implement position step decrease (exponential 1.5x, min 0.5m)
    },

    rotateModelAroundY: (
      state,
      action: PayloadAction<"clockwise" | "counterclockwise">,
    ) => {
      // TODO: Implement model rotation around Y axis using rotationStep
    },

    increaseRotationStep: (state) => {
      // TODO: Implement rotation step increase (grid: 1, 2, 5, 10, 15, 30, 60, 90)
    },

    decreaseRotationStep: (state) => {
      // TODO: Implement rotation step decrease (grid: 1, 2, 5, 10, 15, 30, 60, 90)
    },

    // Scale transformation actions
    increaseModelScale: (state) => {
      // TODO: Implement model scale increase by scaleStep percentage
    },

    decreaseModelScale: (state) => {
      // TODO: Implement model scale decrease by scaleStep percentage
    },

    setScaleStep: (state, action: PayloadAction<number>) => {
      // TODO: Implement scale step change (1% or 5%)
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
    getPositionStep: (state) => state.positionStep,
    getRotationStep: (state) => state.rotationStep,
    getScaleStep: (state) => state.scaleStep,

    // Process state selectors
    getAlignmentProgress: (state) => ({
      isAligning: state.isAligning,
      progress: state.alignmentProgress,
    }),
  },
});

export const {
  setCameraView,
  updateCameraState,
  resetCamera,
  resetAllCameras,
  resetAlignment,
  selectModelForAlignment,
  addPolygonForAlignment,
  resetAlignmentPolygons,
  startAlignmentProcess,
  moveModelInDirection,
  increasePositionStep,
  decreasePositionStep,
  rotateModelAroundY,
  increaseRotationStep,
  decreaseRotationStep,
  increaseModelScale,
  decreaseModelScale,
  setScaleStep,
} = alignmentSlice.actions;

export const {
  getCurrentCamera,
  getCurrentCameraView,
  getSelectedModel,
  getSelectedPolygons,
  getModelTransform,
  getAlignmentTools,
  getPositionStep,
  getRotationStep,
  getScaleStep,
  getAlignmentProgress,
} = alignmentSlice.selectors;

export default alignmentSlice.reducer;
