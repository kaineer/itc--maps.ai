import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Camera state for View mode
export interface ViewCameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

// View mode state
export interface ViewState {
  // Camera state for View mode
  camera: ViewCameraState;
  // Whether camera controls are enabled
  cameraEnabled: boolean;
  // Camera movement speed multiplier
  movementSpeed: number;
  // Fixed camera height (eye level)
  fixedHeight: number;
}

// Default camera position for View mode
const defaultCameraPosition: [number, number, number] = [0, 50, 0];
const defaultCameraTarget: [number, number, number] = [0, 0, 0];
const defaultFov = 60;

const initialState: ViewState = {
  camera: {
    position: defaultCameraPosition,
    target: defaultCameraTarget,
    fov: defaultFov,
  },
  cameraEnabled: true,
  movementSpeed: 5.0,
  fixedHeight: 1.8, // Eye level in meters
};

export const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    // Update camera position
    updateCameraPosition: (
      state,
      action: PayloadAction<[number, number, number]>,
    ) => {
      state.camera.position = action.payload;
    },

    // Update camera target (look-at point)
    updateCameraTarget: (
      state,
      action: PayloadAction<[number, number, number]>,
    ) => {
      state.camera.target = action.payload;
    },

    // Update camera field of view
    updateCameraFov: (state, action: PayloadAction<number>) => {
      state.camera.fov = action.payload;
    },

    // Update entire camera state
    updateCameraState: (state, action: PayloadAction<ViewCameraState>) => {
      state.camera = action.payload;
    },

    // Reset camera to default position
    resetCamera: (state) => {
      state.camera = {
        position: defaultCameraPosition,
        target: defaultCameraTarget,
        fov: defaultFov,
      };
    },

    // Enable/disable camera controls
    setCameraEnabled: (state, action: PayloadAction<boolean>) => {
      state.cameraEnabled = action.payload;
    },

    // Update movement speed
    setMovementSpeed: (state, action: PayloadAction<number>) => {
      state.movementSpeed = action.payload;
    },

    // Update fixed camera height
    setFixedHeight: (state, action: PayloadAction<number>) => {
      state.fixedHeight = action.payload;
    },

    // Reset entire view state to initial values
    resetViewState: (state) => {
      state.camera = initialState.camera;
      state.cameraEnabled = initialState.cameraEnabled;
      state.movementSpeed = initialState.movementSpeed;
      state.fixedHeight = initialState.fixedHeight;
    },
  },
  selectors: {
    // Get entire camera state
    getCameraState: (state) => state.camera,

    // Get camera position
    getCameraPosition: (state) => state.camera.position,

    // Get camera target
    getCameraTarget: (state) => state.camera.target,

    // Get camera field of view
    getCameraFov: (state) => state.camera.fov,

    // Check if camera controls are enabled
    getCameraEnabled: (state) => state.cameraEnabled,

    // Get movement speed
    getMovementSpeed: (state) => state.movementSpeed,

    // Get fixed camera height
    getFixedHeight: (state) => state.fixedHeight,

    // Get entire view state
    getViewState: (state) => state,
  },
});

export const {
  updateCameraPosition,
  updateCameraTarget,
  updateCameraFov,
  updateCameraState,
  resetCamera,
  setCameraEnabled,
  setMovementSpeed,
  setFixedHeight,
  resetViewState,
} = viewSlice.actions;

export const {
  getCameraState,
  getCameraPosition,
  getCameraTarget,
  getCameraFov,
  getCameraEnabled,
  getMovementSpeed,
  getFixedHeight,
  getViewState,
} = viewSlice.selectors;

export default viewSlice.reducer;
