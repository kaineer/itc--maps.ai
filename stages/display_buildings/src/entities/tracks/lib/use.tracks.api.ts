import {
  useGetTracksListQuery,
  usePostTrackMutation,
} from "../model/tracks.api";

export const useTracksApi = () => {
  const { data: tracks, isLoading: isTracksLoading } = useGetTracksListQuery();
  const [createTrack] = usePostTrackMutation();

  return {
    tracks,
    isTracksLoading,
    createTrack,
  };
};
