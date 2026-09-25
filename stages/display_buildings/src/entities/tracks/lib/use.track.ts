import { Track } from "@entities/tracks";

export const useTrack = (track: Track) => {
  const route = "/tracks/" + track.id;

  return { route };
};
