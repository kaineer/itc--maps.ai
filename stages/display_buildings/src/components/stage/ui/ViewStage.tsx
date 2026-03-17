import { UniqueItems } from "@components/shared/UniqueItems";
import { Building } from "../../../types/types";
import { RenderBuilding } from "../../building/ui/RenderBuilding";
import { KeyboardModifiers } from "@utils/keyboardModifiers";

interface Props {
  buildings: Building[];
  onBuildingClick?: (building: Building, keys: KeyboardModifiers) => void;
}

export const ViewStage = ({ buildings, onBuildingClick }: Props) => {
  return (
    <UniqueItems
      items={buildings}
      getKey={(building) => building.model}
      render={(building) => (
        <RenderBuilding
          key={building.model || building.id}
          building={building}
          onBuildingClick={onBuildingClick}
        />
      )}
    />
  );
};
