import { type TrackPointId, type TrackPoint } from "@.types/track-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
  // Point that's currently edited
  currentPointId: TrackPointId | null;
}

const initialState: SliceState = {
  currentPointId: null,
};

export const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setCurrentPoint: (state, action: PayloadAction<TrackPoint | null>) => {
      state.currentPointId = action.payload ? action.payload.id : null;
    },
  },
  selectors: {
    getCurrentPoint: (state) => state.currentPointId,
  },
});
