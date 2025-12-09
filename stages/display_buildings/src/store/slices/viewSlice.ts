import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getBackend } from "../../utils/backend";
import {
  CAMERA_HEIGHTS,
  DISTANCES,
  CAMERA_FOV,
  DEFAULT_CAMERA_POSITIONS,
} from "../../utils/constants";
import { BuildingNode } from "../../types/types";

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
  //
  groundCenter: BuildingNode;
}

// Default camera position for View mode
const defaultCameraPosition: [number, number, number] =
  DEFAULT_CAMERA_POSITIONS.VIEW;
const defaultCameraTarget: [number, number, number] =
  DEFAULT_CAMERA_POSITIONS.VIEW_TARGET;
const defaultFov = CAMERA_FOV.DEFAULT;

const initialState: ViewState = {
  camera: {
    position: defaultCameraPosition,
    target: defaultCameraTarget,
    fov: defaultFov,
  },
  cameraEnabled: true,
  movementSpeed: 5.0,
  fixedHeight: CAMERA_HEIGHTS.EYE_LEVEL, // Eye level in meters
  groundCenter: { x: 0, z: 0 },
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

    // Set ground center
    setGroundCenter: (state, action: PayloadAction<BuildingNode>) => {
      state.groundCenter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle initializeViewCamera thunk
      .addCase(initializeViewCamera.pending, (state) => {
        // Camera initialization in progress
      })
      .addCase(initializeViewCamera.fulfilled, (state, action) => {
        // Camera already updated by the thunk actions
        // No additional state changes needed here
      })
      .addCase(initializeViewCamera.rejected, (state, action) => {
        // Error handled by the thunk caller
      });
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

    // Get ground center
    getGroundCenter: (state) => state.groundCenter,
  },
});

// Async thunk to fetch initial position and update camera
export const initializeViewCamera = createAsyncThunk<{
  position: { x: number; z: number };
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
}>("view/initializeViewCamera", async (_, { dispatch }) => {
  // Fetch starting position from backend
  const data = await getBackend<{ x: number; z: number }>("/start");
  const position = { x: data.x, z: data.z };

  // Update camera state: set target to starting position, camera 10 meters north
  // North is negative Z in Three.js coordinate system
  const cameraTarget: [number, number, number] = [position.x, 0, position.z];
  const cameraPosition: [number, number, number] = [
    position.x,
    CAMERA_HEIGHTS.EYE_LEVEL,
    position.z - DISTANCES.FROM_BUILDING,
  ]; // 10 meters north

  const { setGroundCenter, updateCameraTarget, updateCameraPosition } =
    viewSlice.actions;

  dispatch(setGroundCenter(position));
  dispatch(updateCameraTarget(cameraTarget));
  dispatch(updateCameraPosition(cameraPosition));

  return { position, cameraTarget, cameraPosition };
});
