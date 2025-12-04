import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  loadUIState,
  saveUIState,
  UI_STORAGE_KEY,
} from "../utils/localStorage";

const defaultUIMode = "view";

export type UIMode = "view" | "alignment" | "modelSetup";

export type KnownMode =
  | "topCameraControls"
  | "perspectiveCameraControls"
  | "modelSetupControls"
  | "viewControls";

interface UIState {
  currentMode: UIMode;
  known: Record<KnownMode, boolean>;
}

// Начальное состояние по умолчанию
const defaultInitialState: UIState = {
  currentMode: defaultUIMode,
  known: {
    topCameraControls: false,
    perspectiveCameraControls: false,
    modelSetupControls: false,
    viewControls: false,
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
      };
      // Сохраняем сброшенное состояние
      saveUIState(state);
    },
  },
  selectors: {
    getUIMode: (state) => state.currentMode,
    getKnown: (state) => state.known,
    isKnown: (state, mode: KnownMode) => state.known[mode],
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

export default uiSlice.reducer;
