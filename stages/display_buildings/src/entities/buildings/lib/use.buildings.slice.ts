import { ModelPosition } from "@.types/buildings-types";
import { viewSlice } from "@slices/viewSlice";
import { useDispatch, useSelector } from "react-redux";

export const useBuildingsSlice = () => {
  const { getCameraPosition } = viewSlice.selectors;
  const { updateCameraPosition } = viewSlice.actions;
  const dispatch = useDispatch();

  const cameraPosition = useSelector(getCameraPosition);
  const setCameraPosition = (pos: ModelPosition) => {
    dispatch(updateCameraPosition(pos));
  };

  return {
    // ???
    cameraPosition,
    setCameraPosition,
  };
};
