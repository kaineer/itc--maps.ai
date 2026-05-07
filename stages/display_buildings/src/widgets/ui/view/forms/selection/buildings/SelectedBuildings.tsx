import classes from "./SelectedBuildings.module.css";
import { alignmentSlice } from "@slices/alignmentSlice";
import { useDispatch } from "react-redux";
import { MouseEvent } from "react";
import {
  BuildingWithoutModel,
  ModelPosition,
  type Building,
} from "@.types/types";
import { RemoveButton } from "./RemoveButton";
import { viewSlice } from "@slices/viewSlice";

interface Props {
  buildings: Building[];
}

export const SelectedBuildings = ({ buildings }: Props) => {
  const selectedPolygons = buildings;
  const dispatch = useDispatch();
  const { removePolygonFromAlignment } = alignmentSlice.actions;
  const { moveCameraToLocation } = viewSlice.actions;

  const handleRemovePolygon = (
    building: Building,
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removePolygonFromAlignment(building));
  };

  const handleItemClick = (building: Building) => {
    if (typeof building.model === "undefined") {
      const node = building.nodes[0];
      const position: ModelPosition = [node.x, 0, node.z];
      dispatch(moveCameraToLocation(position));
    }
  };

  return (
    <div className={classes.buildingList}>
      <div className={classes.listHeader}>
        <h4 className={classes.subtitle}>
          Выбранные здания:
          {selectedPolygons && selectedPolygons.length > 0 && (
            <span className={classes.countBadge}>
              {selectedPolygons.length}
            </span>
          )}
        </h4>
      </div>

      {selectedPolygons && selectedPolygons.length > 0 ? (
        <ul className={classes.list}>
          {selectedPolygons.map((building: Building, index: number) => (
            <li key={building.id || index} className={classes.listItem}>
              {/* Отображаем address если он есть, иначе id */}
              <span
                className={classes.buildingName}
                onClick={() => handleItemClick(building)}
              >
                {building.address ? building.address : building.id}
              </span>

              <RemoveButton
                onClick={(e) => handleRemovePolygon(building, e)}
                description={`Удалить ${building.address || building.id}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={classes.emptyMessage}>Здания не выбраны</p>
      )}
    </div>
  );
};
