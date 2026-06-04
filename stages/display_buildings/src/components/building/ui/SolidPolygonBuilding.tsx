import { BasePolygonBuilding } from "./BasePolygonBuilding";
import { Building } from "../../../types/types";
import { useEffect, useState } from "react";
import {
  getKeyboardModifiers,
  KeyboardModifiers,
} from "@utils/keyboardModifiers";
import { useSelectedPolygons } from "@hooks/alignment/useAlignmentSlice";

interface Props {
  building: Building;
  onClick?: (building: Building, keys: KeyboardModifiers) => void;
}

export const SolidPolygonBuilding = ({
  building,
  onClick = () => null,
}: Props) => {
  const { selectedPolygons: polygons } = useSelectedPolygons();
  const highlighted = Boolean(polygons.find((p) => p.id === building.id));

  const [opacity, setOpacity] = useState<number>(0.1);

  useEffect(() => {
    if (opacity < 0.99) {
      setTimeout(() => {
        const nextOpacity = 1 - (1 - opacity) / 2;
        if (nextOpacity >= 0.99) {
          setOpacity(1);
        } else {
          setOpacity(nextOpacity);
        }
      }, 300);
    }
  }, [opacity]);

  const handleClick = (e: any) => {
    if (onClick) {
      // Create a unique building ID using address and position
      // const buildingId = `${building.address}|${building.position?.x},${building.position?.z}`;
      // onClick(buildingId);
      onClick(building, getKeyboardModifiers(e));
    }
  };

  return (
    <BasePolygonBuilding
      building={building}
      highlighted={highlighted}
      opacity={opacity}
      onClick={handleClick}
    />
  );
};
