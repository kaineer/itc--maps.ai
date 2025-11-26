import { Building } from "../../../types/types";
import { TransparentPolygonBuilding } from "../../building/ui/TransparentPolygonBuilding";
import { DebugModelBuilding } from "../../building/ui/DebugModelBuilding";

interface Props {
  buildings: Building[];
  onBuildingClick?: (building: Building) => void;
}

export const AlignmentStage = ({ buildings, onBuildingClick }: Props) => {
  return (
    <>
      {buildings.map((building) => (
        <group
          key={`${building.position?.x}-${building.position?.z}-${building.address}`}
        >
          {/* Display transparent polygons for visual reference */}
          <TransparentPolygonBuilding
            building={building}
            onClick={onBuildingClick}
          />

          {/* Display models for alignment */}
          {building.modelUrl && <DebugModelBuilding building={building} />}
        </group>
      ))}
    </>
  );
};
