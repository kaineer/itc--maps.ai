import { KeyboardModifiers } from "@utils/keyboardModifiers";
import { Building } from "../../../types/types";
import { ModelBuilding } from "./ModelBuilding";
import { SolidPolygonBuilding } from "./SolidPolygonBuilding";

interface Props {
  building: Building;
  onBuildingClick?: (building: Building, keys: KeyboardModifiers) => void;
}

export const RenderBuilding = ({ building, onBuildingClick }: Props) => {
  const { model: modelId } = building;

  const handleBuildingClick = (building: Building, keys: KeyboardModifiers) => {
    if (onBuildingClick) {
      onBuildingClick(building, keys);
    }
  };

  if (typeof modelId === "string") {
    return <ModelBuilding building={building} onClick={handleBuildingClick} />;
  }
  return (
    <SolidPolygonBuilding building={building} onClick={handleBuildingClick} />
  );
};
