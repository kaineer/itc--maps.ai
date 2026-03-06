import { Building } from "../../../types/types";
import { ModelBuilding } from "./ModelBuilding";
import { SolidPolygonBuilding } from "./SolidPolygonBuilding";

interface Props {
  building: Building;
  onBuildingClick?: (building: Building) => void;
}

export const RenderBuilding = ({ building, onBuildingClick }: Props) => {
  const { model: modelId } = building;

  const handleBuildingClick = () => {
    if (onBuildingClick) {
      onBuildingClick(building);
    }
  };

  if (typeof modelId === "string") {
    return <ModelBuilding building={building} onClick={handleBuildingClick} />;
  }
  return (
    <SolidPolygonBuilding building={building} onClick={handleBuildingClick} />
  );
};
