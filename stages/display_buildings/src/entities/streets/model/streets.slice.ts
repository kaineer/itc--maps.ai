import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Street } from "./types";

interface StreetsState {
  streets: Street[];
}

const initialState: StreetsState = {
  streets: [],
};

export const streetsSlice = createSlice({
  name: "streets",
  initialState,
  reducers: {
    setStreets: (state, action: PayloadAction<Street[]>) => {
      state.streets = action.payload;
    },
    resetStreets: (state) => {
      state.streets = [];
    },
  },
  selectors: {
    getStreets: (state) => state.streets,
  },
});
