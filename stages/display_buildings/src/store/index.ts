import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";

export function setupStore() {
  const store = configureStore({
    reducer: {
      ui: uiReducer,
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
