import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
  fileId: string | null;
}

const initialState: SliceState = {
  fileId: null,
};

export const modelUploadSlice = createSlice({
  name: "modelUpload",
  initialState,
  reducers: {
    setFileId: (state, action: PayloadAction<string>) => {
      state.fileId = action.payload;
    },
    resetFileId: (state) => {
      state.fileId = null;
    },
  },
  selectors: {
    getFileId: (state: SliceState) => state.fileId,
  },
});
