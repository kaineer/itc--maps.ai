import { Building } from "../../../types/types";
import { DebugModelBuilding } from "./DebugModelBuilding";
import { ModelBuilding } from "./ModelBuilding";
import { SolidPolygonBuilding } from "./SolidPolygonBuilding";

interface Props {
  building: Building;
  onBuildingClick?: (building: Building) => void;
}

export const RenderBuilding = ({ building, onBuildingClick }: Props) => {
  const { modelUrl } = building;

  const handleBuildingClick = () => {
    if (onBuildingClick) {
      onBuildingClick(building);
    }
  };
  if (typeof modelUrl === "string") {
    // if (modelUrl.startsWith("/")) {
    //   return <DebugModelBuilding building={building} />;
    // }
    return <ModelBuilding building={building} onClick={handleBuildingClick} />;
  }
  return (
    <SolidPolygonBuilding building={building} onClick={handleBuildingClick} />
  );
};
