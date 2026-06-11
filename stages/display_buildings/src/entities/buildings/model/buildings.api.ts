import {
  type Building,
  type BuildingNode,
  type UpdateBuilding,
} from "@.types/buildings-types";
import { buildingsSlice } from "@slices/buildingsSlice";
import { buildingsAndModelsApi } from "@store/api/buildingsAndModelsApi";
import { EYE_LEVEL_HEIGHT } from "@utils/constants";

const { setBuildings, setLastLoadedPosition } = buildingsSlice.actions;

export const buildingsApi = buildingsAndModelsApi.injectEndpoints({
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
      providesTags: ["buildingsList"],
      onQueryStarted: async ({ position }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const { x, z } = position;
          dispatch(setBuildings(data));
          dispatch(setLastLoadedPosition([x, EYE_LEVEL_HEIGHT, z]));
        } catch (err) {
          console.error(err);
        }
      },
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
      invalidatesTags: ["buildingsList"],
    }),
  }),
});

export const {
  useLazyGetStartPositionQuery,
  usePatchPolygonMutation,
  usePutBuildingsQuery,
  useLazyPutBuildingsQuery,
} = buildingsApi;
