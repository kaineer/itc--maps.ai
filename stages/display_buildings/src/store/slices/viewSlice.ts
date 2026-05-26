import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  CAMERA_HEIGHTS,
  DISTANCES,
  CAMERA_FOV,
  DEFAULT_CAMERA_POSITIONS,
  EYE_LEVEL_HEIGHT,
} from "@utils/constants";
import { BuildingNode, ModelPosition } from "../../types/types";
import { createBackendService } from "@services/backendService";
import { TrackId, TrackPoint, TrackPointId } from "@.types/track-types";
import { MarkerPoint } from "./minimapSlice";

const backendService = createBackendService();

// Camera state for View mode
export interface ViewCameraState {
  position: ModelPosition;
  target: ModelPosition;
  fov: number;
  preset: boolean;
}

interface TrackPointData {
  trackId: TrackId;
  point: TrackPoint;
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
  //
  notification: boolean;
  //
  minimap: boolean;
  //
  pointToAttach: TrackPointData | null;
  //
  activeMarker: MarkerPoint | null;
}

// Default camera position for View mode
const defaultCameraPosition: ModelPosition = DEFAULT_CAMERA_POSITIONS.VIEW;
const defaultCameraTarget: ModelPosition = DEFAULT_CAMERA_POSITIONS.VIEW_TARGET;
const defaultFov = CAMERA_FOV.DEFAULT;

const initialState: ViewState = {
  camera: {
    position: defaultCameraPosition,
    target: defaultCameraTarget,
    fov: defaultFov,
    preset: false,
  },
  cameraEnabled: true,
  movementSpeed: 5.0,
  fixedHeight: CAMERA_HEIGHTS.EYE_LEVEL, // Eye level in meters
  groundCenter: { x: 0, z: 0 },
  // TODO: это явный хак, есичо
  notification: false,
  minimap: true,
  pointToAttach: null,
  activeMarker: null,
};

export const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    // Update camera position
    updateCameraPosition: (state, action: PayloadAction<ModelPosition>) => {
      state.camera.position = action.payload;
    },

    // Update camera target (look-at point)
    updateCameraTarget: (state, action: PayloadAction<ModelPosition>) => {
      state.camera.target = action.payload;
    },

    setCameraPreset: (state) => {
      state.camera.preset = true;
    },

    clearCameraPreset: (state) => {
      state.camera.preset = false;
    },

    moveCameraToLocation: (state, action: PayloadAction<ModelPosition>) => {
      const position = action.payload;
      const [x, _, z] = position;

      state.camera.position = [x, EYE_LEVEL_HEIGHT, z];
      state.camera.target = [x, EYE_LEVEL_HEIGHT, z + 10];
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
        preset: false,
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

    enableNotification: (state) => {
      state.notification = true;
    },

    disableNotification: (state) => {
      state.notification = false;
    },

    enableMinimap: (state) => {
      state.minimap = true;
    },

    disableMinimap: (state) => {
      state.minimap = false;
    },

    setPointToAttach: (state, action: PayloadAction<TrackPointData | null>) => {
      state.pointToAttach = action.payload;
    },

    clearPointToAttach: (state) => {
      state.pointToAttach = null;
    },

    setActiveMarker: (state, action: PayloadAction<MarkerPoint | null>) => {
      state.activeMarker = action.payload;
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
    // getCameraState: (state) => state.camera,

    // Get camera position
    getCameraPosition: (state): ModelPosition => {
      const [x, _, z] = state.camera.position;
      return [x, 500, z];
    },

    // Get camera target
    getCameraTarget: (state): ModelPosition => {
      return state.camera.target;
    },

    // Get camera field of view
    getCameraFov: (state) => state.camera.fov,

    // Check if camera controls are enabled
    getCameraEnabled: (state) => state.cameraEnabled,

    // Get movement speed
    getMovementSpeed: (state) => state.movementSpeed,

    // Get fixed camera height
    getFixedHeight: (state) => state.fixedHeight,

    // Get ground center
    getGroundCenter: (state) => state.groundCenter,

    //
    getNotificationEnabled: (state) => state.notification,

    //
    getMinimapEnabled: (state) => state.minimap,

    //
    getPointToAttach: (state) => state.pointToAttach,

    //
    getActiveMarker: (state) => state.activeMarker,
  },
});

// Async thunk to fetch initial position and update camera
export const initializeViewCamera = createAsyncThunk<{
  position: { x: number; z: number };
  cameraTarget: ModelPosition;
  cameraPosition: ModelPosition;
}>("view/initializeViewCamera", async (_, { getState, dispatch }) => {
  // Fetch starting position from backend

  const { hash } = window.location;
  const parts = hash.slice(1).split("&");
  const fromHash = hash && Array.isArray(parts) && parts.length > 1;
  const [x, z] = parts.map((p) => Number(p.split("=")[1]));

  const state = getState();
  const camera = state.view.camera;
  const viewPosition = camera.position;

  const loadStartPosition = async () => {
    try {
      const data = await backendService.get("buildings/start");
      return data;
    } catch (error) {
      console.log(error);
      debugger;
    }
  };

  // TODO: так быть не должно
  const viewTarget = camera.target || [
    viewPosition[0],
    EYE_LEVEL_HEIGHT,
    viewPosition[2] + 20,
  ];
  const cameraPreset = camera.preset;

  const loadedPosition = fromHash
    ? { x, z }
    : // : await backendService.get("buildings/start");
      await loadStartPosition();
  const presetPosition = { x: viewPosition[0], z: viewPosition[2] };

  const position = cameraPreset ? presetPosition : loadedPosition;

  // Update camera state: set target to starting position, camera 10 meters north
  // North is negative Z in Three.js coordinate system
  const cameraTarget: ModelPosition = cameraPreset
    ? viewTarget
    : [position.x, 0, position.z];
  const cameraPosition: ModelPosition = cameraPreset
    ? viewPosition
    : [
        position.x,
        CAMERA_HEIGHTS.EYE_LEVEL,
        position.z - DISTANCES.FROM_BUILDING,
      ]; // 10 meters north

  const {
    setGroundCenter,
    updateCameraTarget,
    updateCameraPosition,
    clearCameraPreset,
  } = viewSlice.actions;

  dispatch(setGroundCenter(position));
  dispatch(updateCameraTarget(cameraTarget));
  dispatch(updateCameraPosition(cameraPosition));
  dispatch(clearCameraPreset());

  return { position, cameraTarget, cameraPosition };
});
