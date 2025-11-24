import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Building, BuildingNode } from "../types/types";

interface BuildingsResponse {
  buildings: Building[];
}

interface BuildingsState {
  buildings: Building[];
  selectedBuildingId: string | null;
  loading: boolean;
  error: string | null;
  filters: {
    hasModel: boolean | null;
    searchQuery: string;
  };
}

const initialState: BuildingsState = {
  buildings: [],
  selectedBuildingId: null,
  loading: false,
  error: null,
  filters: {
    hasModel: null,
    searchQuery: "",
  },
};

// Async thunk for fetching buildings
export const fetchBuildings = createAsyncThunk(
  "buildings/fetchBuildings",
  async ({
    position,
    distance,
  }: {
    position: BuildingNode;
    distance: number;
  }) => {
    const response = await fetch("http://localhost:5000/buildings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position,
        distance,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BuildingsResponse = await response.json();
    return data.buildings || [];
  },
);

export const buildingsSlice = createSlice({
  name: "buildings",
  initialState,
  reducers: {
    setSelectedBuilding: (state, action: PayloadAction<string | null>) => {
      state.selectedBuildingId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setHasModelFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filters.hasModel = action.payload;
    },
    clearFilters: (state) => {
      state.filters.searchQuery = "";
      state.filters.hasModel = null;
    },
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
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading = false;
        state.buildings = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch buildings";
      });
  },
  selectors: {
    getBuildings: (state) => state.buildings,
    getSelectedBuildingId: (state) => state.selectedBuildingId,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getFilters: (state) => state.filters,
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
  },
});
