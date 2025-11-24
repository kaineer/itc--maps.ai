import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UIMode = "view" | "alignment" | "modelSetup";

interface UIState {
  currentMode: UIMode;
}

const initialState: UIState = {
  currentMode: "view",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setUIMode: (state, action: PayloadAction<UIMode>) => {
      state.currentMode = action.payload;
    },
    resetUI: (state) => {
      state.currentMode = "view";
    },
  },
});

export const { setUIMode, resetUI } = uiSlice.actions;

export const selectUIMode = (state: { ui: UIState }) => state.ui.currentMode;

export default uiSlice.reducer;
