import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  createStoreMiddleware,
  loadSliceState,
} from "../../utils/localStorage";

export type KnownMode =
  | "topCameraControls"
  | "perspectiveCameraControls"
  | "viewControls";

interface HelpInfoState {
  known: Record<KnownMode, boolean>;
}

const defaultInitialState: HelpInfoState = {
  known: {
    topCameraControls: false,
    perspectiveCameraControls: false,
    viewControls: false,
  },
};

const name = "helpInfo";

const initialState: HelpInfoState = loadSliceState<HelpInfoState>(
  name,
  defaultInitialState,
);

export const helpInfoSlice = createSlice({
  name,
  initialState,
  reducers: {
    setKnown: (state, action: PayloadAction<KnownMode>) => {
      const mode = action.payload;
      state.known[mode] = true;
    },
  },
  selectors: {
    getKnown: (state) => state.known,
  },
});

export const helpInfoStorageMiddleware = createStoreMiddleware(name);
