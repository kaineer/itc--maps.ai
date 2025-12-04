import { configureStore } from "@reduxjs/toolkit";
import { uiSlice, uiLocalStorageMiddleware } from "./uiSlice";
import { buildingsSlice } from "./buildingsSlice";
import { alignmentSlice } from "./alignmentSlice";
import { viewSlice } from "./viewSlice";

export function setupStore() {
  const store = configureStore({
    reducer: {
      [uiSlice.reducerPath]: uiSlice.reducer,
      [buildingsSlice.reducerPath]: buildingsSlice.reducer,
      [alignmentSlice.reducerPath]: alignmentSlice.reducer,
      [viewSlice.reducerPath]: viewSlice.reducer,
      // Add other reducers here as they are created
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"],
        },
      }).concat(uiLocalStorageMiddleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
}

export type RootState = ReturnType<ReturnType<typeof setupStore>["getState"]>;
export type AppDispatch = ReturnType<typeof setupStore>["dispatch"];
