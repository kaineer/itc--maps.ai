import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { initializeViewCamera } from "./viewSlice";
import { Building, BuildingNode, ModelPosition } from "../../types/types";
import {
  DEFAULT_CAMERA_POSITIONS,
  DISTANCES,
  COORDINATES,
} from "@utils/constants";

import { createBackendService } from "@services/backendService";

type BuildingsResponse = Building[];

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
  // Active filters for building list
  filters: {
    // Filter by model presence: true=has model, false=no model, null=show all
    hasModel: boolean | null;
    // Search query for filtering by address
    searchQuery: string;
  };
}

const defaultCameraPosition = DEFAULT_CAMERA_POSITIONS.VIEW;

const initialState: BuildingsState = {
  buildings: [],
  selectedBuildingId: null,
  loading: false,
  error: null,
  filters: {
    hasModel: null, // Show all buildings by default
    searchQuery: "", // No search filter by default
  },
  lastLoadedPosition: defaultCameraPosition,
};

const backendService = createBackendService();

// Async thunk for fetching initial position from backend API
// Gets the starting position for the application
export const fetchInitialPosition = createAsyncThunk(
  "buildings/fetchInitialPosition",
  async () => {
    try {
      const data = (await backendService.get("start")) as {
        x: number;
        z: number;
      };
      return { x: data.x, z: data.z };
    } catch (err) {
      return COORDINATES.START;
    }
  },
);

// Async thunk for fetching buildings from backend API
// Fetches buildings within specified distance from given position
export const fetchBuildings = createAsyncThunk(
  "buildings/fetchBuildings",
  async ({
    position,
    distance,
  }: {
    position: BuildingNode;
    distance: number;
  }) => {
    const data: BuildingsResponse = (await backendService.put("buildings", {
      position,
      distance,
    })) as BuildingsResponse;

    return data || [];
  },
);

// Async thunk for fetching initial position and then buildings
// First gets starting position, then fetches buildings within 300 meters
export const fetchInitialBuildings = createAsyncThunk<Building[]>(
  "buildings/fetchInitialBuildings",
  async (_, { dispatch }) => {
    // First, initialize camera with starting position
    const cameraResult = await dispatch(initializeViewCamera());

    if (initializeViewCamera.fulfilled.match(cameraResult)) {
      const { position } = cameraResult.payload;
      const distance = DISTANCES.BUILDING_DISTANCE;

      // Then, fetch buildings around that position
      const buildingsResult = await dispatch(
        fetchBuildings({ position, distance }),
      );

      return buildingsResult.payload as Building[];
    }

    throw new Error("Failed to initialize camera with starting position");
  },
);

export const buildingsSlice = createSlice({
  name: "buildings",
  initialState,
  reducers: {
    // Select or deselect a building for operations like alignment or model setup
    setSelectedBuilding: (state, action: PayloadAction<string | null>) => {
      state.selectedBuildingId = action.payload;
    },
    // Set search query for filtering buildings by address
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    // Filter buildings by model presence (true = has model, false = no model, null = show all)
    setHasModelFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filters.hasModel = action.payload;
    },
    // Clear all active filters (search query and model filter)
    clearFilters: (state) => {
      state.filters.searchQuery = "";
      state.filters.hasModel = null;
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
      state.filters.searchQuery = "";
      state.filters.hasModel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle initial position fetch
      .addCase(fetchInitialPosition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialPosition.fulfilled, (state) => {
        // Position fetched successfully, but buildings not loaded yet
        // Keep loading state true for the subsequent buildings fetch
      })
      .addCase(fetchInitialPosition.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch initial position";
      })
      // Handle building fetch request start
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle successful building fetch
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading = false;
        state.buildings = action.payload;
        const { x, z } = action.meta.arg.position;
        state.lastLoadedPosition = [x, 0, z];
      })
      // Handle building fetch failure
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch buildings";
      })
      // Handle combined initial buildings fetch
      .addCase(fetchInitialBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInitialBuildings.fulfilled,
        (state, action: PayloadAction<Building[]>) => {
          state.loading = false;
          state.buildings = action.payload;
        },
      )
      .addCase(fetchInitialBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch initial buildings";
      });
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
    // Get current filter settings
    getFilters: (state) => state.filters,
    //
    getLastLoadedPosition: (state) => state.lastLoadedPosition,
    // Get buildings filtered by current search query and model presence
    getFilteredBuildings: (state) => {
      let filtered = state.buildings;

      // Filter by model presence
      if (state.filters.hasModel !== null) {
        filtered = filtered.filter(
          (building) => !!building.modelUrl === state.filters.hasModel,
        );
      }

      // Filter by search query
      if (state.filters.searchQuery) {
        const query = state.filters.searchQuery.toLowerCase();
        filtered = filtered.filter((building) =>
          building.address?.toLowerCase().includes(query),
        );
      }

      return filtered;
    },
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

export const {
  setSelectedBuilding,
  setSearchQuery,
  setHasModelFilter,
  clearFilters,
  setBuildings,
  resetBuildings,
} = buildingsSlice.actions;

export const {
  getBuildings,
  getSelectedBuildingId,
  getSelectedBuilding,
  getLoading,
  getError,
  getFilters,
  getFilteredBuildings,
} = buildingsSlice.selectors;

export default buildingsSlice.reducer;
