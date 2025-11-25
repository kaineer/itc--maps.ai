import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CameraView = "perspective" | "top";

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface AlignmentState {
  // Camera management
  currentCameraView: CameraView;
  cameraStates: Record<CameraView, CameraState>;

  // Model transformation
  selectedModelId: string | null;
  modelPosition: [number, number, number];
  modelRotation: [number, number, number];
  modelScale: [number, number, number];

  // Alignment tools
  snapToPolygon: boolean;
  showGrid: boolean;
  showAxes: boolean;

  // Temporary alignment data
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

  selectedModelId: null,
  modelPosition: [0, 0, 0],
  modelRotation: [0, 0, 0],
  modelScale: [1, 1, 1],

  snapToPolygon: true,
  showGrid: true,
  showAxes: true,

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

    // Model selection and transformation
    selectModel: (state, action: PayloadAction<string | null>) => {
      state.selectedModelId = action.payload;
    },

    setModelPosition: (
      state,
      action: PayloadAction<[number, number, number]>,
    ) => {
      state.modelPosition = action.payload;
    },

    setModelRotation: (
      state,
      action: PayloadAction<[number, number, number]>,
    ) => {
      state.modelRotation = action.payload;
    },

    setModelScale: (state, action: PayloadAction<[number, number, number]>) => {
      state.modelScale = action.payload;
    },

    resetModelTransform: (state) => {
      state.modelPosition = [0, 0, 0];
      state.modelRotation = [0, 0, 0];
      state.modelScale = [1, 1, 1];
    },

    // Alignment tools
    toggleSnapToPolygon: (state) => {
      state.snapToPolygon = !state.snapToPolygon;
    },

    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },

    toggleAxes: (state) => {
      state.showAxes = !state.showAxes;
    },

    // Alignment process
    startAlignment: (state) => {
      state.isAligning = true;
      state.alignmentProgress = 0;
    },

    updateAlignmentProgress: (state, action: PayloadAction<number>) => {
      state.alignmentProgress = action.payload;
    },

    completeAlignment: (state) => {
      state.isAligning = false;
      state.alignmentProgress = 100;
    },

    cancelAlignment: (state) => {
      state.isAligning = false;
      state.alignmentProgress = 0;
    },

    // Reset everything
    resetAlignment: () => initialState,
  },

  selectors: {
    getCurrentCamera: (state) => state.cameraStates[state.currentCameraView],
    getCurrentCameraView: (state) => state.currentCameraView,
    getSelectedModelId: (state) => state.selectedModelId,
    getModelTransform: (state) => ({
      position: state.modelPosition,
      rotation: state.modelRotation,
      scale: state.modelScale,
    }),
    getAlignmentTools: (state) => ({
      snapToPolygon: state.snapToPolygon,
      showGrid: state.showGrid,
      showAxes: state.showAxes,
    }),
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
  selectModel,
  setModelPosition,
  setModelRotation,
  setModelScale,
  resetModelTransform,
  toggleSnapToPolygon,
  toggleGrid,
  toggleAxes,
  startAlignment,
  updateAlignmentProgress,
  completeAlignment,
  cancelAlignment,
  resetAlignment,
} = alignmentSlice.actions;

export const {
  getCurrentCamera,
  getCurrentCameraView,
  getSelectedModelId,
  getModelTransform,
  getAlignmentTools,
  getAlignmentProgress,
} = alignmentSlice.selectors;

export default alignmentSlice.reducer;
