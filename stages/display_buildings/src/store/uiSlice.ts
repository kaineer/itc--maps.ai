import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultUIMode = "view";

export type UIMode = "view" | "alignment" | "modelSetup";

export type KnownMode =
  | "topCameraControls"
  | "perspectiveCameraControls"
  | "modelSetupControls";

interface UIState {
  currentMode: UIMode;
  known: Record<KnownMode, boolean>;
}

const initialState: UIState = {
  currentMode: defaultUIMode,
  known: {
    topCameraControls: false,
    perspectiveCameraControls: false,
    modelSetupControls: false,
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    selectViewMode: (state) => {
      state.currentMode = "view";
    },
    selectAligmentMode: (state) => {
      state.currentMode = "alignment";
    },
    selectModelSetupMode: (state) => {
      state.currentMode = "modelSetup";
    },
    resetUI: (state) => {
      state.currentMode = defaultUIMode;
    },
    setKnown: (state, action: PayloadAction<KnownMode>) => {
      state.known[action.payload] = true;
    },
    clearKnown: (state, action: PayloadAction<KnownMode>) => {
      state.known[action.payload] = false;
    },
    resetAllKnown: (state) => {
      state.known = {
        topCameraControls: false,
        perspectiveCameraControls: false,
        modelSetupControls: false,
      };
    },
  },
  selectors: {
    getUIMode: (state) => state.currentMode,
    getKnown: (state) => state.known,
    isKnown: (state, mode: KnownMode) => state.known[mode],
  },
});
