import { useDispatch, useSelector } from "react-redux";
import { uiSlice, BuildingFormMode } from "@slices/uiSlice";
import { BuildingSearch } from "./BuildingSearch";
import { Logout } from "./Logout";
import { BuildingSelection } from "./building-selection/BuildingSelection";
import classes from "./BuildingFormsGroup.module.css";
import { UserList } from "./UserList";
import { BuildingEdit } from "./BuildingEdit";

export const BuildingFormsGroup = () => {
  const dispatch = useDispatch();

  const { getBuildingFormMode } = uiSlice.selectors;
  const { setBuildingFormMode } = uiSlice.actions;

  const buildingFormMode = useSelector(getBuildingFormMode);

  const isModeEnabled = (mode: BuildingFormMode): boolean => {
    return buildingFormMode === "none" || mode === buildingFormMode;
  };

  const handleFormToggle = (mode: BuildingFormMode) => (expanded: boolean) => {
    if (expanded) {
      dispatch(setBuildingFormMode(mode));
    } else {
      dispatch(setBuildingFormMode("none"));
    }
  };

  return (
    <div className={classes.group}>
      <BuildingSearch
        enabled={isModeEnabled("search")}
        onToggled={handleFormToggle("search")}
      />
      <BuildingSelection
        enabled={isModeEnabled("select")}
        onToggled={handleFormToggle("select")}
      />
      <BuildingEdit
        enabled={isModeEnabled("edit")}
        onToggled={handleFormToggle("edit")}
      />
      <UserList enabled={isModeEnabled("none")} />
      <Logout enabled={isModeEnabled("none")} />
    </div>
  );
};
