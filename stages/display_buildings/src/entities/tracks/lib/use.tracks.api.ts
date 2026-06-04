import { TrackId, TrackPoint, TrackPointId } from "@.types/track-types";
import {
  useGetTracksListQuery,
  usePostTrackMutation,
  useDeleteTrackMutation,
  useGetTrackPointsQuery,
  usePostTrackPointMutation,
  useDeleteTrackPointMutation,
  usePutTrackPointMutation,
} from "../model/tracks.api";
import { useCallback, useEffect, useState } from "react";

export const useTracksApi = () => {
  const { data: tracks, isLoading: isTracksLoading } = useGetTracksListQuery();
  const [createTrack] = usePostTrackMutation();
  const [deleteTrack] = useDeleteTrackMutation();

  return {
    tracks,
    isTracksLoading,
    createTrack,
    deleteTrack,
  };
};

export const useTrackPointsApi = (trackId: TrackId = "") => {
  const { data, isLoading } = useGetTrackPointsQuery(trackId);
  const [createPointRequest] = usePostTrackPointMutation();
  const [removePointRequest] = useDeleteTrackPointMutation();
  const [updatePointRequest] = usePutTrackPointMutation();
  const [points, setPoints] = useState<TrackPoint[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isLoading && data) {
      setPoints(data.points);
      setName(data.name);
    }
  }, [data, isLoading, trackId]);

  const createPoint = useCallback(
    (pointData: Omit<TrackPoint, "id">) => {
      return createPointRequest({
        trackId,
        ...pointData,
      }).unwrap();
    },
    [trackId],
  );

  const removePoint = useCallback(
    (pointId: TrackPointId) => {
      return removePointRequest({
        trackId,
        id: pointId,
      }).unwrap();
    },
    [trackId],
  );

  const updatePoint = useCallback(
    (point: TrackPoint) => {
      return updatePointRequest({
        ...point,
        trackId,
      }).unwrap();
    },
    [trackId],
  );

  return {
    points,
    name,

    createPoint,
    removePoint,
    updatePoint,
  };
};
