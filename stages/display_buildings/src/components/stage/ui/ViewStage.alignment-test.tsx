import { Building } from "../../../types/types";
import { RenderBuilding } from "../../building/ui/RenderBuilding";

interface Props {
  buildings: Building[];
  onBuildingClick?: (buildingId: string) => void;
}

export const ViewStage = ({ buildings, onBuildingClick }: Props) => {
  return (
    <>
      {buildings.map((building) => (
        <RenderBuilding
          key={`${building.id}-${building.position?.x}-${building.position?.z}-${building.address}`}
          building={building}
          onBuildingClick={onBuildingClick}
        />
      ))}
    </>
  );
};
