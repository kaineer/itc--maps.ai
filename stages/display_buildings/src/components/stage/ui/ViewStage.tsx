import { Building } from "../../../types/types";
import { RenderBuilding } from "../../building/ui/RenderBuilding";

interface Props {
  buildings: Building[];
}

export const ViewStage = ({ buildings }: Props) => {
  return (
    <>
      {buildings.map((building) => (
        <RenderBuilding
          key={`${building.position?.x}-${building.position?.z}-${building.address}`}
          building={building}
        />
      ))}
    </>
  );
};
