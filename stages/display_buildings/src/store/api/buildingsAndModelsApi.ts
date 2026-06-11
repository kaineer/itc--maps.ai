import { createApi } from "@reduxjs/toolkit/query/react";
import { createBackendService } from "@services/backendService";

const { baseQuery } = createBackendService();

export const buildingsAndModelsApi = createApi({
  reducerPath: "base/api",
  baseQuery,
  tagTypes: ["buildingsList", "model"],
  endpoints: () => ({}),
});

export const {} = buildingsAndModelsApi;
