import { useDispatch, useSelector } from "react-redux";
import { uiSlice, BuildingFormMode } from "@slices/uiSlice";
// import { BuildingSearch } from "./BuildingSearch";
import { Logout } from "./Logout";
import { BuildingSelection } from "./building-selection/BuildingSelection";
import classes from "./BuildingFormsGroup.module.css";
import { UserList } from "./UserList";
import { BuildingEdit } from "./BuildingEdit";
import { ToggleMinimap } from "./ToggleMinimap";
import { BuildingModelEdit } from "./BuildingModelEdit";

export const BuildingFormsGroup = () => {
  const dispatch = useDispatch();

  const { getBuildingFormMode } = uiSlice.selectors;
  const { setBuildingFormMode } = uiSlice.actions;

  const buildingFormMode = useSelector(getBuildingFormMode);

  const isModeEnabled = (mode: BuildingFormMode): boolean => {
    return buildingFormMode === "none" || mode === buildingFormMode;
  };

  const handleFormToggle = (mode: BuildingFormMode) => (expanded: boolean) => {
    const sendMode = expanded ? mode : "none";
    dispatch(setBuildingFormMode(sendMode));
  };

  return (
    <div className={classes.group}>
      <BuildingSelection
        enabled={isModeEnabled("select")}
        onToggled={handleFormToggle("select")}
      />
      <BuildingEdit
        enabled={isModeEnabled("edit")}
        onToggled={handleFormToggle("edit")}
      />
      <BuildingModelEdit
        enabled={isModeEnabled("edit-model")}
        onToggled={handleFormToggle("edit-model")}
      />
      <UserList enabled={isModeEnabled("none")} />
      <ToggleMinimap enabled={isModeEnabled("none")} />
      <Logout enabled={isModeEnabled("none")} />
    </div>
  );
};
