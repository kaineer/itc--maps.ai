import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./slices/uiSlice";
import { buildingsSlice } from "./slices/buildingsSlice";
import { alignmentSlice } from "./slices/alignmentSlice";
import { viewSlice } from "./slices/viewSlice";
import { modelUploadSlice } from "./slices/modelUploadSlice";
import { authenticationSlice } from "@slices/authenticationSlice";
import {
  helpInfoSlice,
  helpInfoStorageMiddleware,
} from "./slices/helpInfoSlice";
import { rtkQueryErrorHandler } from "./middleware/unauthorized";
import { userApi } from "./api/UsersApi";

export function setupStore() {
  const store = configureStore({
    reducer: {
      [uiSlice.reducerPath]: uiSlice.reducer,
      [buildingsSlice.reducerPath]: buildingsSlice.reducer,
      [alignmentSlice.reducerPath]: alignmentSlice.reducer,
      [viewSlice.reducerPath]: viewSlice.reducer,
      [modelUploadSlice.reducerPath]: modelUploadSlice.reducer,
      [helpInfoSlice.reducerPath]: helpInfoSlice.reducer,
      [authenticationSlice.reducerPath]: authenticationSlice.reducer,
      // Add other reducers here as they are created

      // API
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"],
        },
      }).concat(
        helpInfoStorageMiddleware,
        rtkQueryErrorHandler,
        // API
        userApi.middleware,
      ),
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
}

// export type RootState = ReturnType<ReturnType<typeof setupStore>["getState"]>;
export type AppDispatch = ReturnType<typeof setupStore>["dispatch"];
