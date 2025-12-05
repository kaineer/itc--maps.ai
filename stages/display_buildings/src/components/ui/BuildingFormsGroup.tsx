import { useDispatch, useSelector } from "react-redux";
import { uiSlice, BuildingFormMode } from "../../store/uiSlice";
import { BuildingSearch } from "./BuildingSearch";
import { BuildingSelection } from "./BuildingSelection";

export const BuildingFormsGroup = () => {
  const dispatch = useDispatch();

  const { getBuildingFormMode } = uiSlice.selectors;
  const { setBuildingFormMode } = uiSlice.actions;

  const buildingFormMode = useSelector(getBuildingFormMode);

  const isModeEnabled = (mode: BuildingFormMode): boolean => {
    return (buildingFormMode === "none" || mode === buildingFormMode);
  }

  const handleFormToggle = (mode: BuildingFormMode) => (expanded: boolean) => {
    if (expanded) {
      dispatch(setBuildingFormMode(mode));
    }
  }

  return (
    <>
      <BuildingSearch
        enabled={isModeEnabled("search")}
        onToggled={handleFormToggle("search")}
      />
      <BuildingSelection />
    </>
  );
}
