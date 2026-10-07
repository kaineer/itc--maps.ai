import type { Street, StreetsQuery } from "./types";
import { streetsSlice } from "./streets.slice";
import { buildingsAndModelsApi } from "@store/api/buildingsAndModelsApi";

const { setStreets } = streetsSlice.actions;

export const streetsApi = buildingsAndModelsApi.injectEndpoints({
  endpoints: (build) => ({
    PutStreets: build.query<Street[], StreetsQuery>({
      query: ({ position, distance }) => ({
        url: "streets",
        method: "PUT",
        body: {
          position,
          distance,
        },
      }),
      providesTags: ["streetsList"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setStreets(data));
        } catch (err) {
          console.error(err);
        }
      },
    }),
  }),
});

export const { usePutStreetsQuery, useLazyPutStreetsQuery } = streetsApi;
