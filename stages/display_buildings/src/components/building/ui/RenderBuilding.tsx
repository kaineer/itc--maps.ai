import { Building } from "../../../types/types";
import { DebugModelBuilding } from "./DebugModelBuilding";
import { ModelBuilding } from "./ModelBuilding";
import { SolidPolygonBuilding } from "./SolidPolygonBuilding";

interface Props {
  building: Building;
  onBuildingClick?: (buildingId: string) => void;
}

export const RenderBuilding = ({ building, onBuildingClick }: Props) => {
  const { modelUrl, address, position } = building;

  const handleBuildingClick = () => {
    if (onBuildingClick) {
      // Create a unique building ID using address and position
      const buildingId = `${address}|${position?.x},${position?.z}`;
      onBuildingClick(buildingId);
    }
  };
  if (typeof modelUrl === "string") {
    if (modelUrl.startsWith("/")) {
      return <DebugModelBuilding building={building} />;
    }
    return <ModelBuilding building={building} />;
  }
  return <SolidPolygonBuilding building={building} />;
};
