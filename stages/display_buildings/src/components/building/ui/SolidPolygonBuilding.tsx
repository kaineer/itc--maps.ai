import { BasePolygonBuilding } from "./BasePolygonBuilding";
import { Building } from "../../../types/types";
import { alignmentSlice } from "@slices/alignmentSlice";
import { useSelector } from "react-redux";

interface Props {
  building: Building;
  // onClick?: (buildingId: string) => void;
  onClick?: (building: Building) => void;
}

export const SolidPolygonBuilding = ({
  building,
  onClick = () => null,
}: Props) => {
  const { getSelectedPolygons } = alignmentSlice.selectors;
  const polygons = useSelector(getSelectedPolygons);
  const highlighted = Boolean(polygons.find((p) => p.id === building.id));

  const handleClick = () => {
    if (onClick) {
      // Create a unique building ID using address and position
      // const buildingId = `${building.address}|${building.position?.x},${building.position?.z}`;
      // onClick(buildingId);
      onClick(building);
    }
  };
  return (
    <BasePolygonBuilding
      building={building}
      highlighted={highlighted}
      opacity={1.0}
      onClick={handleClick}
    />
  );
};
