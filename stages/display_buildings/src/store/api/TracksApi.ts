import { QueryObjects } from "@.types/buildings-types";
import type {
  CreateTrack,
  CreateTrackPoint,
  DeleteTrackPoint,
  Track,
  TrackId,
  TrackPoint,
  TrackWithPoints,
  UpdateTrackPoint,
} from "@.types/track-types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBackendService } from "@services/backendService";

const backendService = createBackendService();
const { baseQuery } = backendService;

export const tracksApi = createApi({
  reducerPath: "tracks/api",
  baseQuery,
  tagTypes: ["tracks", "points"],
  endpoints: (build) => ({
    getTracksList: build.query<Track[], void>({
      query: () => ({
        url: "/tracks",
        method: "GET",
      }),
      providesTags: ["tracks"],
    }),
    postTrack: build.mutation<Track, CreateTrack>({
      query: ({ name }) => ({
        url: "/tracks",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["tracks"],
    }),
    deleteTrack: build.mutation<void, TrackId>({
      query: (trackId) => ({
        url: "/tracks/" + trackId,
        method: "DELETE",
      }),
      invalidatesTags: ["tracks"],
    }),
    // PUT: Получить точки по координатам и расстоянию
    queryTrackPoints: build.query<TrackPoint[], QueryObjects>({
      query: (pointAndDistance) => ({
        url: "/tracks/around-point",
        method: "PUT",
        body: pointAndDistance,
      }),
      providesTags: ["points"],
    }),
    getTrackPoints: build.query<TrackWithPoints, TrackId>({
      query: (trackId) => ({
        url: "/tracks/" + trackId,
        method: "GET",
      }),
      providesTags: ["points"],
    }),
    postTrackPoint: build.mutation<TrackPoint, CreateTrackPoint>({
      query: ({ trackId, ...point }) => ({
        url: "/tracks/" + trackId,
        method: "POST",
        body: point,
      }),
      invalidatesTags: ["points"],
    }),
    putTrackPoint: build.mutation<TrackPoint, UpdateTrackPoint>({
      query: ({ trackId, id, ...point }) => ({
        url: ["tracks", trackId, id].join("/"),
        method: "PUT",
        body: point,
      }),
      invalidatesTags: ["points"],
    }),
    deleteTrackPoint: build.mutation<void, DeleteTrackPoint>({
      query: ({ id, trackId }) => ({
        url: ["tracks", trackId, id].join("/"),
        method: "DELETE",
      }),
      invalidatesTags: ["points"],
    }),
  }),
});

export const {
  useGetTracksListQuery,
  usePostTrackMutation,
  useDeleteTrackMutation,
  useGetTrackPointsQuery,
  usePostTrackPointMutation,
  usePutTrackPointMutation,
  useDeleteTrackPointMutation,
  useQueryTrackPointsQuery,
  useLazyQueryTrackPointsQuery,
} = tracksApi;
