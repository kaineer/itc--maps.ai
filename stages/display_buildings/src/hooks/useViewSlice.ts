import { viewSlice } from "@slices/viewSlice";
import { useSelector } from "react-redux";

const {
  getCameraPosition,
  getCameraTarget,
  getCameraFov,
  getPointToAttach,
  getMinimapEnabled,
  getActiveMarker,
} = viewSlice.selectors;

export const useViewCamera = () => {
  const cameraPosition = useSelector(getCameraPosition);
  const cameraTarget = useSelector(getCameraTarget);
  const cameraFov = useSelector(getCameraFov);

  return { cameraPosition, cameraTarget, cameraFov };
};

export const useViewMarkers = () => {
  const pointToAttach = useSelector(getPointToAttach);
  const activeMarker = useSelector(getActiveMarker);

  return { pointToAttach, activeMarker };
};

export const useViewMinimap = () => {
  const minimapEnabled = useSelector(getMinimapEnabled);

  return { minimapEnabled };
};
