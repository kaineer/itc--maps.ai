import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Building, ModelPosition } from "../../types/types";
import { DEFAULT_CAMERA_POSITIONS } from "@utils/constants";

interface BuildingsState {
  // List of all loaded buildings
  buildings: Building[];
  // ID of currently selected building (for alignment/model setup)
  selectedBuildingId: string | null;
  // Loading state for async operations
  loading: boolean;
  // Error message if any operation fails
  error: string | null;
  //
  lastLoadedPosition: ModelPosition;
}

const defaultCameraPosition = DEFAULT_CAMERA_POSITIONS.VIEW;

const initialState: BuildingsState = {
  buildings: [],
  selectedBuildingId: null,
  loading: false,
  error: null,
  lastLoadedPosition: defaultCameraPosition,
};

export const buildingsSlice = createSlice({
  name: "buildings",
  initialState,
  reducers: {
    // Select or deselect a building for operations like alignment or model setup
    setSelectedBuilding: (state, action: PayloadAction<string | null>) => {
      state.selectedBuildingId = action.payload;
    },
    // Set buildings directly (for testing and development)
    setBuildings: (state, action: PayloadAction<Building[]>) => {
      state.buildings = action.payload;
    },
    // Reset entire buildings state to initial values
    resetBuildings: (state) => {
      state.buildings = [];
      state.selectedBuildingId = null;
      state.loading = false;
      state.error = null;
    },
    setLastLoadedPosition: (state, action: PayloadAction<ModelPosition>) => {
      state.lastLoadedPosition = action.payload;
    },
  },
  selectors: {
    // Get all buildings (unfiltered)
    getBuildings: (state) => state.buildings,
    // Get currently selected building ID
    getSelectedBuildingId: (state) => state.selectedBuildingId,
    // Get loading state for building operations
    getLoading: (state) => state.loading,
    // Get error message if any
    getError: (state) => state.error,
    //
    getLastLoadedPosition: (state) => state.lastLoadedPosition,
    // Get the currently selected building object by ID
    getSelectedBuilding: (state) => {
      if (!state.selectedBuildingId) return null;

      // Since buildings don't have IDs yet, we'll use address + position as identifier
      // This is a temporary solution until we have proper building IDs
      const [address, position] = state.selectedBuildingId.split("|");
      return (
        state.buildings.find(
          (building) =>
            building.address === address &&
            building.position?.x === parseFloat(position.split(",")[0]) &&
            building.position?.z === parseFloat(position.split(",")[1]),
        ) || null
      );
    },
    //
    getIsAuthenticated: (state) => {
      return (
        !state.error ||
        !String(state.error).toLowerCase().includes("not authenticated")
      );
    },
  },
});
