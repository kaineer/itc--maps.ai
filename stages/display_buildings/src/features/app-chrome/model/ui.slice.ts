import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultUIMode = "intro";

// Режимы работы приложения
export type UIMode = "intro" | "login" | "view" | "alignment";

// Форма, показанная в интерфейсе
export type BuildingFormMode =
  | "none"
  | "offer"
  | "search"
  | "select"
  | "edit"
  | "edit-model";

interface SidebarState {
  hidden: boolean;
  expanded: boolean;
  disabled: boolean;
}

interface UIState {
  currentMode: UIMode;
  buildingFormMode: BuildingFormMode;

  sidebar: SidebarState;
}

// Начальное состояние по умолчанию
const initialState: UIState = {
  currentMode: defaultUIMode,
  buildingFormMode: "none",

  sidebar: {
    hidden: true,
    expanded: false,
    disabled: false,
  },
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
    setSidebarHidden: (state, action: PayloadAction<boolean>) => {
      state.sidebar.hidden = action.payload;
    },
    toggleSidebarHidden: (state) => {
      const { sidebar } = state;
      if (!sidebar.disabled) {
        sidebar.hidden = !sidebar.hidden;
      }
    },
    toggleSidebarExpanded: (state) => {
      state.sidebar.expanded = !state.sidebar.expanded;
    },
    setSidebarExpanded: (state, action: PayloadAction<boolean>) => {
      state.sidebar.expanded = action.payload;
    },
  },
  selectors: {
    getUIMode: (state) => state.currentMode,
    getBuildingFormMode: (state) => state.buildingFormMode,
    getSidebarDisplay: (state) => {
      const { sidebar } = state;
      if (sidebar.hidden) {
        return "IDLE";
      } else {
        return sidebar.expanded ? "EXPANDED" : "HOVER";
      }
    },
    getSidebarShowLabel: (state) => {
      const {
        sidebar: { hidden, expanded },
      } = state;
      return !hidden && expanded;
    },
    getSidebarShowItem: (state) => {
      const {
        sidebar: { hidden },
      } = state;

      return !hidden;
    },
  },
});
