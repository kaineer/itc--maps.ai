import { ModelPosition } from "@.types/buildings-types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react";

export interface MarkerPoint {
  lat: number;
  lon: number;
  position: ModelPosition;
  target: ModelPosition;
  name: string;
  description: string;
}

interface MinimapState {
  zoom: number;
  center: [number, number];
  markers: MarkerPoint[];
  // in meters
  lastLoadedCenter: ModelPosition;
}

const initialState: MinimapState = {
  zoom: 13,
  center: [0, 0],
  markers: [],
  lastLoadedCenter: [0, 0, 0],
};

export const minimapSlice = createSlice({
  name: "minimap",
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      const center = action.payload;
      state.center = center;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setLastLoadedCenter: (state, action: PayloadAction<ModelPosition>) => {
      state.lastLoadedCenter = action.payload;
    },
    setMarkers: (state, action: PayloadAction<MarkerPoint[]>) => {
      state.markers = action.payload;
    },
  },
  selectors: {
    getCenter: (state): [number, number] => state.center,
    getZoom: (state): number => state.zoom,
    getLastLoadedCenter: (state): ModelPosition => state.lastLoadedCenter,
    getMarkers: (state): MarkerPoint[] => state.markers,
  },
});
