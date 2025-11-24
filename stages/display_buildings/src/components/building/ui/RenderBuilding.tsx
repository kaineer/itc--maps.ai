import { Building } from "../../../types/types";
import { DebugModelBuilding } from "./DebugModelBuilding";
import { ModelBuilding } from "./ModelBuilding";
import { SolidPolygonBuilding } from "./SolidPolygonBuilding";

interface Props {
  building: Building;
}

export const RenderBuilding = ({ building }: Props) => {
  const { modelUrl } = building;
  if (typeof modelUrl === "string") {
    if (modelUrl.startsWith("/")) {
      return <DebugModelBuilding building={building} />;
    }
    return <ModelBuilding building={building} />;
  }
  return <SolidPolygonBuilding building={building} />;
};
