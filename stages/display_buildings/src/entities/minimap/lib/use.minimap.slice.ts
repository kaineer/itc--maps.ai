import { minimapSlice } from "../model/minimap.slice";
import { useSelector } from "react-redux";

const { getCenter, getZoom, getLastLoadedCenter, getMarkers } =
  minimapSlice.selectors;

export const useMinimapPosition = () => {
  const center = useSelector(getCenter);
  const zoom = useSelector(getZoom);
  const lastLoadedCenter = useSelector(getLastLoadedCenter);

  return { center, zoom, lastLoadedCenter };
};

export const useMinimapMarkers = () => {
  const markers = useSelector(getMarkers);
  return { markers };
};
