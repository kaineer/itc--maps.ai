import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultUIMode = "intro";

// Режимы работы приложения
export type UIMode = "intro" | "login" | "view" | "alignment";

// Форма, показанная в интерфейсе
export type BuildingFormMode = "none" | "search" | "select";

interface UIState {
  currentMode: UIMode;
  buildingFormMode: BuildingFormMode;
}

// Начальное состояние по умолчанию
const initialState: UIState = {
  currentMode: defaultUIMode,
  buildingFormMode: "none",
};

const name = "ui";

export const uiSlice = createSlice({
  name,
  initialState,
  reducers: {
    selectLoginMode: (state) => {
      state.currentMode = "login";
    },
    selectViewMode: (state) => {
      state.currentMode = "view";
    },
    selectAlignmentMode: (state) => {
      state.currentMode = "alignment";
    },
    setBuildingFormMode: (state, action: PayloadAction<BuildingFormMode>) => {
      state.buildingFormMode = action.payload;
    },
    cleanupBuildingFormMode: (state) => {
      state.buildingFormMode = "none";
    },
  },
  selectors: {
    getUIMode: (state) => state.currentMode,
    getBuildingFormMode: (state) => state.buildingFormMode,
  },
});
