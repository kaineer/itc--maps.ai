import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  // TODO: Implement based on alignment scenarios documentation
  // Basic camera state for now
  currentCameraView: CameraView;
  cameraStates: Record<CameraView, CameraState>;

  // TODO: Add model and polygon data based on scenarios
  // selectedPolygons: Polygon[];
  // currentModel: ModelData | null;
  // modelTransform: ModelTransform;
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

  // TODO: Initialize model and polygon data based on scenarios
  // selectedPolygons: [],
  // currentModel: null,
  // modelTransform: {
  //   position: [0, 0, 0],
  //   rotation: [0, 0, 0],
  //   scale: [1, 1, 1],
  // },
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

    // TODO: Add scenario-specific actions
    // autoPositionModel: (state) => {
    //   // TODO: Implement automatic positioning logic from scenarios
    // },
    //
    // moveModel: (state, action: PayloadAction<{ x: number; z: number }>) => {
    //   // TODO: Implement model translation (Shift+WASD)
    // },
    //
    // rotateModel: (state, action: PayloadAction<number>) => {
    //   // TODO: Implement model rotation (Alt+A/D)
    // },
  },

  selectors: {
    getCurrentCamera: (state) => state.cameraStates[state.currentCameraView],
    getCurrentCameraView: (state) => state.currentCameraView,

    // TODO: Add selectors for model and polygon data based on scenarios
    // getSelectedModel: (state) => state.currentModel,
    // getSelectedPolygons: (state) => state.selectedPolygons,
    // getModelTransform: (state) => state.modelTransform,
    // getAlignmentTools: (state) => ({
    //   snapToPolygon: state.snapToPolygon,
    //   showGrid: state.showGrid,
    //   showAxes: state.showAxes,
    // }),
  },
});
