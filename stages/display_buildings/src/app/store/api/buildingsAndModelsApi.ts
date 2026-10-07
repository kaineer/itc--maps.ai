import { createApi } from "@reduxjs/toolkit/query/react";
import { createBackendService } from "@shared/api";

const { baseQuery } = createBackendService();

export const buildingsAndModelsApi = createApi({
  reducerPath: "base/api",
  baseQuery,
  tagTypes: ["buildingsList", "streetsList", "model"],
  endpoints: () => ({}),
});

export const { } = buildingsAndModelsApi;
