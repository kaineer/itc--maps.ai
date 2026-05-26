import { buildingsSlice } from "@slices/buildingsSlice";
import { useSelector } from "react-redux";

const {
  getBuildings,
  getSelectedBuildingId,
  getLastLoadedPosition,
  getLoading,
  getError,
} = buildingsSlice.selectors;

export const useBuildingsSlice = () => {
  const buildings = useSelector(getBuildings);
  const selectedBuildingId = useSelector(getSelectedBuildingId);
  const lastLoadedPosition = useSelector(getLastLoadedPosition);

  const loading = useSelector(getLoading);
  const error = useSelector(getError);

  return { buildings, selectedBuildingId, lastLoadedPosition, loading, error };
};
