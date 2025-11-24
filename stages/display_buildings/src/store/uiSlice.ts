import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UIMode = 'view' | 'alignment';

interface UIState {
  currentMode: UIMode;
  selectedBuildingId: string | null;
  isControlsVisible: boolean;
}

const initialState: UIState = {
  currentMode: 'view',
  selectedBuildingId: null,
  isControlsVisible: true,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUIMode: (state, action: PayloadAction<UIMode>) => {
      state.currentMode = action.payload;
    },
    setSelectedBuilding: (state, action: PayloadAction<string | null>) => {
      state.selectedBuildingId = action.payload;
    },
    toggleControls: (state) => {
      state.isControlsVisible = !state.isControlsVisible;
    },
    resetUI: (state) => {
      state.currentMode = 'view';
      state.selectedBuildingId = null;
      state.isControlsVisible = true;
    },
  },
});

export const { setUIMode, setSelectedBuilding, toggleControls, resetUI } = uiSlice.actions;

export const selectUIMode = (state: { ui: UIState }) => state.ui.currentMode;
export const selectSelectedBuildingId = (state: { ui: UIState }) => state.ui.selectedBuildingId;
export const selectIsControlsVisible = (state: { ui: UIState }) => state.ui.isControlsVisible;

export default uiSlice.reducer;
