import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  loadUIState,
  saveUIState,
  UI_STORAGE_KEY,
} from "../utils/localStorage";

const defaultUIMode = "intro";

export type UIMode = "view" | "alignment" | "modelSetup" | "intro";

export type KnownMode =
  | "topCameraControls"
  | "perspectiveCameraControls"
  | "modelSetupControls"
  | "viewControls"
  | "buildingSearch";

export type BuildingFormMode = "none" | "search" | "select";

interface UIState {
  currentMode: UIMode;
  buildingFormMode: BuildingFormMode;
  known: Record<KnownMode, boolean>;
}

// Начальное состояние по умолчанию
const defaultInitialState: UIState = {
  currentMode: defaultUIMode,
  buildingFormMode: "none",
  known: {
    topCameraControls: false,
    perspectiveCameraControls: false,
    modelSetupControls: false,
    viewControls: false,
    buildingSearch: false,
  },
};

// Загружаем начальное состояние из localStorage или используем состояние по умолчанию
const initialState: UIState = loadUIState(defaultInitialState);

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
    selectIntroMode: (state) => {
      state.currentMode = "intro";
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
        viewControls: false,
        buildingSearch: false,
      };
      // Сохраняем сброшенное состояние
      saveUIState(state);
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
    getKnown: (state) => state.known,
    isKnown: (state, mode: KnownMode) => state.known[mode],
    getBuildingFormMode: (state) => state.buildingFormMode,
  },
});

// Middleware для автоматического сохранения состояния в localStorage при изменениях
export const uiLocalStorageMiddleware =
  (store: any) => (next: any) => (action: any) => {
    const result = next(action);

    // Сохраняем состояние только если действие относится к uiSlice
    if (action.type.startsWith("ui/")) {
      const state = store.getState();
      if (state.ui) {
        saveUIState(state.ui);
      }
    }

    return result;
  };
