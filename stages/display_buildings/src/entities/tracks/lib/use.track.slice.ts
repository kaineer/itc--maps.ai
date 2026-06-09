import { useSelector } from "react-redux";
import { tracksSlice } from "../model/tracks.slice";
import { type TrackPoint } from "@.types/track-types";

const { getCurrentPoint } = tracksSlice.selectors;

export const useCurrentPointId = () => {
  const currentPointId = useSelector(getCurrentPoint);
  const isPointCurrent = (point: TrackPoint): boolean => {
    return point.id === currentPointId;
  };

  return {
    isPointCurrent,
  };
};
