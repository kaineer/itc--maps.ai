import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./uiSlice";
import { buildingsSlice } from "./buildingsSlice";

export function setupStore() {
  const store = configureStore({
    reducer: {
      [uiSlice.reducerPath]: uiSlice.reducer,
      [buildingsSlice.reducerPath]: buildingsSlice.reducer,
      // Add other reducers here as they are created
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"],
        },
      }),
    devTools: process.env.NODE_ENV !== "production",
  });

  return store;
}

export type RootState = ReturnType<ReturnType<typeof setupStore>["getState"]>;
export type AppDispatch = ReturnType<typeof setupStore>["dispatch"];
