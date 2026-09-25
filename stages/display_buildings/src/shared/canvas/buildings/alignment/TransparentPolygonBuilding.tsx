import { BasePolygonBuilding } from "../BasePolygonBuilding";
import type { Building } from "@shared/model/buildings-types";

interface Props {
  building: Building;
  onClick?: (building: Building) => void;
}

export const TransparentPolygonBuilding = ({ building, onClick }: Props) => {
  return (
    <BasePolygonBuilding building={building} opacity={0.5} onClick={onClick} />
  );
};
