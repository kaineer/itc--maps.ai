import { Building } from "../../../types/types";
import { ModelBuilding } from "./ModelBuilding";
import { SolidPolygonBuilding } from "./SolidPolygonBuilding";

interface Props {
  building: Building;
  onBuildingClick?: (building: Building, ctrlKey: boolean) => void;
}

export const RenderBuilding = ({ building, onBuildingClick }: Props) => {
  const { model: modelId } = building;

  const handleBuildingClick = (building: Building, ctrlKey: boolean) => {
    if (onBuildingClick) {
      onBuildingClick(building, ctrlKey);
    }
  };

  if (typeof modelId === "string") {
    return <ModelBuilding building={building} onClick={handleBuildingClick} />;
  }
  return (
    <SolidPolygonBuilding building={building} onClick={handleBuildingClick} />
  );
};
