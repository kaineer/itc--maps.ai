import { UniqueItems } from "@components/shared/UniqueItems";
import { Building } from "../../../types/types";
import { RenderBuilding } from "../../building/ui/RenderBuilding";

interface Props {
  buildings: Building[];
  onBuildingClick?: (building: Building) => void;
}

export const ViewStage = ({ buildings, onBuildingClick }: Props) => {
  return (
    <UniqueItems<Building, string>
      items={buildings}
      getKey={(building) => building.model || building.id}
      render={(building, key) => (
        <RenderBuilding
          key={key}
          building={building}
          onBuildingClick={onBuildingClick}
        />
      )}
    />
  );
};
