import { useViewCamera } from "@hooks/view/useViewSlice";
import { useBuildingsSlice } from "./use.buildings.slice";
import {
  useLazyGetStartPositionQuery,
  useLazyPutBuildingsQuery,
} from "../model/buildings.api";
import { CAMERA_HEIGHTS, DISTANCES, EYE_LEVEL_HEIGHT } from "@utils/constants";
import { useDispatch } from "react-redux";
import { viewSlice } from "@slices/viewSlice";
import { type ModelPosition } from "@.types/buildings-types";
import { buildingsSlice } from "@slices/buildingsSlice";
import { useEffect } from "react";
import { distance2dBetween } from "@shared/lib/position/positionMath";
import { parseLocationHash } from "@utils/parseLocationHash";

const {
  setGroundCenter,
  updateCameraTarget,
  updateCameraPosition,
  clearCameraPreset,
} = viewSlice.actions;

export const useBuildingsApi = () => {
  const { cameraPosition } = useViewCamera();
  const { lastLoadedPosition } = useBuildingsSlice();
  const [getStartPosition] = useLazyGetStartPositionQuery();
  const [getBuildingsInArea] = useLazyPutBuildingsQuery();
  const dispatch = useDispatch();

  // NOTE: Почему мы здесь не используем полученные здания?
  //   Потому, что dispatch(setBuildings(...)) вызывается прямо в запросе
  //   в ключе onQueryStarted
  //
  const fetchBuildings = async (x: number, z: number) =>
    getBuildingsInArea({
      position: { x, z },
      distance: DISTANCES.BUILDING_DISTANCE,
    }).unwrap();

  const initializeViewCamera = (x: number, z: number) => {
    const position = { x, z };
    const cameraTarget: ModelPosition = [x, 0, z];
    const cameraPosition: ModelPosition = [
      x,
      CAMERA_HEIGHTS.EYE_LEVEL,
      z - DISTANCES.FROM_BUILDING,
    ];

    dispatch(setGroundCenter(position));
    dispatch(updateCameraTarget(cameraTarget));
    dispatch(updateCameraPosition(cameraPosition));
    dispatch(clearCameraPreset());
  };

  const initializeBuildings = async () => {
    const fetchBuildingsAndInitializeCamera = async (x: number, z: number) => {
      await fetchBuildings(x, z);
      initializeViewCamera(x, z);
    };

    const result = parseLocationHash();
    const { fromHash } = result;

    if (fromHash) {
      const { x, z } = result;
      fetchBuildingsAndInitializeCamera(x, z);
    } else {
      const { x, z } = await getStartPosition().unwrap();
      fetchBuildingsAndInitializeCamera(x, z);
    }
  };

  useEffect(() => {
    if (
      distance2dBetween(cameraPosition, lastLoadedPosition) >
      DISTANCES.LAST_LOADED_CAMERA_DISTANCE
    ) {
      const [x, _, z] = cameraPosition;
      fetchBuildings(x, z);
    }
  }, [cameraPosition, lastLoadedPosition]);

  return {
    initializeBuildings,
  };
};
