import { createSlice } from "@reduxjs/toolkit";

const defaultUIMode = "view";

export type UIMode = "view" | "alignment" | "modelSetup";

interface UIState {
  currentMode: UIMode;
}

const initialState: UIState = {
  currentMode: defaultUIMode,
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
  },
  selectors: {
    getUIMode: (state) => state.currentMode,
  },
});
