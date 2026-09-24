import { BasePolygonBuilding } from "../BasePolygonBuilding";
import type { Building } from "@shared/model/buildings-types";
import { useEffect, useState } from "react";
import {
  getKeyboardModifiers,
  KeyboardModifiers,
} from "@shared/lib/keyboardModifiers";
interface Props {
  building: Building;
  highlighted?: boolean;
  onClick?: (building: Building, keys: KeyboardModifiers) => void;
}

export const SolidPolygonBuilding = ({
  building,
  highlighted = false,
  onClick = () => null,
}: Props) => {

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
