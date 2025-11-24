import { BasePolygonBuilding } from "./BasePolygonBuilding";
import { Building } from "../../../types/types";

interface Props {
  building: Building;
  onClick?: (buildingId: string) => void;
}

export const SolidPolygonBuilding = ({ building, onClick }: Props) => {
  const handleClick = () => {
    if (onClick) {
      // Create a unique building ID using address and position
      const buildingId = `${building.address}|${building.position?.x},${building.position?.z}`;
      onClick(buildingId);
    }
  };
  return (
    <BasePolygonBuilding
      building={building}
      opacity={1.0}
      onClick={handleClick}
    />
  );
};
