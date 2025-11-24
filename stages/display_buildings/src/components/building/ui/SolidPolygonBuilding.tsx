import { BasePolygonBuilding } from "./BasePolygonBuilding";
import { Building } from "../../../types/types";

interface Props {
  building: Building;
  onClick?: (building: Building) => void;
}

export const SolidPolygonBuilding = ({ building, onClick }: Props) => {
  return (
    <BasePolygonBuilding
      building={building}
      opacity={1.0}
      onClick={onClick}
    />
  );
};
