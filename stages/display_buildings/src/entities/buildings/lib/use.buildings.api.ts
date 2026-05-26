import { type Building, type ModelPosition } from "@.types/buildings-types";
import { useCallback, useEffect, useState } from "react";
import {
  useLazyGetStartPositionQuery,
  useLazyPutBuildingsQuery,
} from "../model/buildings.api";
import { distance2dBetween } from "@components/shared/positionMath";
import { DISTANCES } from "@utils/constants";
import { useNotification } from "@hooks/useNotification";
import { useBuildingsSlice } from "./use.buildings.slice";

export const useBuildingsApi = () => {
  const [initialized, setInitialized] = useState(false);

  const [loadedPosition, setLoadedPosition] = useState<ModelPosition>([
    0, 0, 0,
  ]);

  const { cameraPosition, setCameraPosition } = useBuildingsSlice();

  const [buildings, setBuildings] = useState<Building[]>([]);

  const { notify } = useNotification();

  const setLoadedPositionOnLoad = (pos: ModelPosition) => {
    const [x, _, z] = pos;
    const query = ["x=" + x, "z=" + z].join("&");
    window.location.hash = query;

    setLoadedPosition(pos);
  };

  // API
  const [getStartPosition] = useLazyGetStartPositionQuery();
  const [getBuildings, { isLoading: isBuildingsLoading }] =
    useLazyPutBuildingsQuery();

  const fetchBuildings = useCallback(async () => {
    try {
      const buildingsList = await getBuildings({
        position: {
          x: cameraPosition[0],
          z: cameraPosition[2],
        },
        distance: DISTANCES.BUILDING_DISTANCE,
      }).unwrap();

      setLoadedPositionOnLoad(cameraPosition);
      setBuildings(buildingsList);
    } catch (err) {
      notify("Не удается загрузить здания", err);
      setBuildings([]);
    }
  }, [cameraPosition]);

  useEffect(() => {
    const { hash } = window.location;
    const parts = hash.slice(1).split("&");
    const fromHash = hash && Array.isArray(parts) && parts.length > 1;
    const [x, z] = parts.map((p) => Number(p.split("=")[1]));

    if (fromHash) {
      setCameraPosition([x, 0, z]);
      setInitialized(true);
      fetchBuildings();
    }
  }, []);

  useEffect(() => {
    if (!initialized) {
      // Дергаем загрузку исходной позиции
      const fetcher = async () => {
        const { x, z } = await getStartPosition().unwrap();
        setCameraPosition([x, 0, z]);
        setInitialized(true);
      };

      fetcher();
    }
  }, [initialized]);

  useEffect(() => {
    if (
      !initialized ||
      distance2dBetween(cameraPosition, loadedPosition) >
        DISTANCES.LAST_LOADED_CAMERA_DISTANCE
    ) {
      fetchBuildings();
    }
  }, [cameraPosition, loadedPosition]);

  return {
    buildings,
    isBuildingsLoading,
  };
};
