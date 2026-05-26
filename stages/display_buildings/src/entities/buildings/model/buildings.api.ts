import {
  type Building,
  type BuildingNode,
  type UpdateBuilding,
} from "@.types/buildings-types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBackendService } from "@services/backendService";

const backendService = createBackendService();
const { baseQuery } = backendService;

export const buildingsApi = createApi({
  reducerPath: "building/api",
  baseQuery,
  tagTypes: ["buildingList"],
  endpoints: (build) => ({
    GetStartPosition: build.query<{ x: number; z: number }, void>({
      query: () => ({
        url: "buildings/start",
        method: "GET",
      }),
    }),
    PutBuildings: build.query<
      Building[],
      { position: BuildingNode; distance: number }
    >({
      query: ({ position, distance }) => ({
        url: "buildings",
        method: "PUT",
        body: {
          position,
          distance,
        },
      }),
      providesTags: ["buildingList"],
    }),
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

export const {
  useLazyGetStartPositionQuery,
  usePatchPolygonMutation,
  usePutBuildingsQuery,
  useLazyPutBuildingsQuery,
} = buildingsApi;
