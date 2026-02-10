import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModelData } from "@utils/modelTransform";
import { FBXLoader } from "three/examples/jsm/Addons.js";
import { Box3 } from "three";
import { createBackendService } from "@services/backendService";
import { useAuthentication } from "@hooks/useAuthentication";

interface SliceState {
  fileId: string | null;
  loading: boolean;
  error: string | null;
  loadedModel: ModelData | null;
}

const initialState: SliceState = {
  fileId: null,
  loading: false,
  error: null,
  loadedModel: null,
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
      state.loadedModel = null;
    },
    clearLoadedModel: (state) => {
      state.loadedModel = null;
    },
    setLoadedModel: (state, action: PayloadAction<ModelData>) => {
      state.loadedModel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModelById.fulfilled, (state, action) => {
        state.loading = false;
        state.loadedModel = action.payload;
        // Автоматически устанавливаем fileId из загруженной модели
        state.fileId = action.payload.id;
      })
      .addCase(fetchModelById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Ошибка загрузки модели";
        state.fileId = null;
      });
  },
  selectors: {
    getFileId: (state) => state.fileId,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getLoadedModel: (state) => state.loadedModel,
  },
});

export const setFileIdAndLoad = createAsyncThunk(
  "modelUpload/setFileIdAndLoad",
  async (fileId: string, { dispatch }) => {
    // const { setFileId } = modelUploadSlice.actions;
    // dispatch(setFileId(fileId));
    // return await dispatch(fetchModelById(fileId)).unwrap();

    try {
      const result = await dispatch(fetchModelById(fileId)).unwrap();
      console.log("🟢 Dispatch completed, result:", result);
      return result;
    } catch (error) {
      console.error("🔴 Dispatch failed:", error);
    }
  },
);

// Async thunk для загрузки модели по ID
export const fetchModelById = createAsyncThunk(
  "modelUpload/fetchModelById",
  async (modelId: string, { rejectWithValue }) => {
    try {
      debugger;
      const { download, urlForEndpoint } = useAuthentication() || {
        download: () => null,
        urlForEndpoint: () => "",
      };

      const response = await download(urlForEndpoint("/model/" + modelId));
      if (!response.ok) {
        throw new Error(`Ошибка загрузки модели: ${response.statusText}`);
      }
      const modelBlob = await response.blob();
      const modelUrl = URL.createObjectURL(modelBlob);

      return new Promise<ModelData>((resolve, reject) => {
        const loader = new FBXLoader();

        loader.load(
          modelUrl,
          (modelObject) => {
            URL.revokeObjectURL(modelUrl);

            // Рассчитываем bounding box
            const boundingBox = new Box3().setFromObject(modelObject);

            // Подсчитываем количество вертексов
            let vertexCount = 0;
            modelObject.traverse((child: any) => {
              if (child.isMesh) {
                vertexCount += child.geometry.attributes.position.count;
              }
            });

            const modelData: ModelData = {
              id: modelId,
              modelObject,
              metadata: {
                fileFormat: "fbx",
                vertexCount,
                boundingBox,
              },
            };

            resolve(modelData);
          },
          undefined, // onProgress (опционально)
          (error: any) => {
            URL.revokeObjectURL(modelUrl);
            reject(new Error(`Ошибка загрузки FBX: ${error.message}`));
          },
        );
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
