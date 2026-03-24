import { createSlice, type PayloadAction } from "@reduxjs/toolkit/react";

interface MinimapState {
  zoom: number;
  center: [number, number];
}

const initialState: MinimapState = {
  zoom: 13,
  center: [0, 0],
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
  },
  selectors: {
    getCenter: (state): [number, number] => state.center,
    getZoom: (state): number => state.zoom,
  },
});
