import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  alignmentBuildingId: string | null;
  isControlsVisible: boolean;
}

const initialState: UIState = {
  alignmentBuildingId: null,
  isControlsVisible: true,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAlignmentBuilding: (state, action: PayloadAction<string | null>) => {
      state.alignmentBuildingId = action.payload;
    },
    toggleControls: (state) => {
      state.isControlsVisible = !state.isControlsVisible;
    },
    resetUI: (state) => {
      state.alignmentBuildingId = null;
      state.isControlsVisible = true;
    },
  },
});

export const { setAlignmentBuilding, toggleControls, resetUI } =
  uiSlice.actions;

export const selectAlignmentBuildingId = (state: { ui: UIState }) =>
  state.ui.alignmentBuildingId;
export const selectIsControlsVisible = (state: { ui: UIState }) =>
  state.ui.isControlsVisible;

export default uiSlice.reducer;
