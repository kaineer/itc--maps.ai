import { ModelPosition } from "@.types/buildings-types";
import { viewSlice } from "@slices/viewSlice";
import { useDispatch, useSelector } from "react-redux";

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

export const useViewCameraActions = () => {
  const { updateCameraPosition, updateCameraTarget } = viewSlice.actions;
  const dispatch = useDispatch();

  const updateCamera = (position: ModelPosition, target: ModelPosition) => {
    dispatch(updateCameraPosition(position));
    dispatch(updateCameraTarget(target));
  };

  return { updateCamera };
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
