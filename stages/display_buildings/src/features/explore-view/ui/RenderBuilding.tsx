import { KeyboardModifiers } from "@shared/lib/keyboardModifiers";
import type { Building } from "@shared/model/buildings-types";
import { ModelBuilding } from "./ModelBuilding";
import { SolidPolygonBuilding } from "@canvas/buildings/view/SolidPolygonBuilding";

interface Props {
  building: Building;
  highlighted?: boolean;
  onBuildingClick?: (building: Building, keys: KeyboardModifiers) => void;
}

export const RenderBuilding = ({
  building,
  highlighted = false,
  onBuildingClick,
}: Props) => {
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
    <SolidPolygonBuilding
      building={building}
      highlighted={highlighted}
      onClick={handleBuildingClick}
    />
  );
};
