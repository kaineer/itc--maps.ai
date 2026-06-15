import { KeyboardModifiers } from "@utils/keyboardModifiers";
import { useMinimapMarkers } from "@entities/minimap/lib/use.minimap.slice";
import { MapItems } from "@kit/utils/MapItems";
import { UniqueItems } from "@kit/utils/UniqueItems";
import { TrackPointMarker } from "@entities/minimap/ui/TrackPointMarker";
import { Building } from "@.types/buildings-types";
import { RenderBuilding } from "@canvas/buildings/view/RenderBuilding";

interface Props {
  buildings: Building[];
  onBuildingClick?: (building: Building, keys: KeyboardModifiers) => void;
}

export const ViewStage = ({ buildings, onBuildingClick }: Props) => {
  const { markers } = useMinimapMarkers();

  return (
    <>
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
      <MapItems
        items={markers}
        render={(marker) => {
          const { position, target } = marker;
          const [x, _, z] = position;
          const [tx, _2, tz] = target;
          return (
            <TrackPointMarker position={[-x, 0, z]} target={[-tx, 0, tz]} />
          );
        }}
      />
    </>
  );
};
