import { Track } from "@.types/track-types";

export const useTrack = (track: Track) => {
  const route = "/tracks/" + track.id;

  return { route };
};
