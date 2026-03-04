import { Building } from "@.types/buildings-types";
import { RenderBuildingTop } from "@components/building/ui/RenderBuildingTop";
import { MapItems } from "@components/shared/MapItems";

interface Props {
  buildings: Building[];
  onBuildingClick?: (building: Building) => void;
}

export const ViewTopStage = ({
  buildings,
  onBuildingClick = () => null,
}: Props) => {
  return (
    <MapItems
      items={buildings}
      render={(building) => (
        <RenderBuildingTop
          key={building.id}
          building={building}
          onBuildingClick={onBuildingClick}
        />
      )}
    />
  );
};
