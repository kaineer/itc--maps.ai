import { Building, UpdateBuilding } from "@.types/buildings-types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBackendService } from "@services/backendService";

const backendService = createBackendService();
const { baseQuery } = backendService;

export const buildingsApi = createApi({
  reducerPath: "building/api",
  baseQuery,
  tagTypes: ["buildingList"],
  endpoints: (build) => ({
    PatchPolygon: build.mutation<Building, UpdateBuilding>({
      query: ({ id, address, height }) => ({
        url: "buildings/" + id,
        method: "PATCH",
        body: {
          address,
          height,
        },
      }),
      invalidatesTags: ["buildingList"],
    }),
  }),
});

export const { usePatchPolygonMutation } = buildingsApi;
