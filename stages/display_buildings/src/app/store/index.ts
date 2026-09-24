import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "@features/app-chrome";
import { buildingsSlice } from "@entities/buildings";
import { alignmentSlice } from "@features/align-model";
import { viewSlice } from "@features/explore-view";
import { modelUploadSlice } from "@entities/models";
import { authenticationSlice } from "@entities/session";
import { minimapSlice } from "@entities/minimap";
import {
  helpInfoSlice,
  helpInfoStorageMiddleware,
} from "@features/control-hints";
import { rtkQueryErrorHandler } from "./middleware/unauthorized";

import { apiReducers } from "./api";
import { apiMiddlewares } from "./api/apiMiddlewares";
import { tracksSlice } from "@entities/tracks";

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
      [minimapSlice.reducerPath]: minimapSlice.reducer,
      [tracksSlice.reducerPath]: tracksSlice.reducer,
      // Add other reducers here as they are created

      // API
      ...apiReducers,
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
        ...apiMiddlewares,
      ),
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
}

// export type RootState = ReturnType<ReturnType<typeof setupStore>["getState"]>;
export type AppDispatch = ReturnType<typeof setupStore>["dispatch"];
