import { KeyboardModifiers } from "@shared/lib/keyboardModifiers";
import { useMinimapMarkers, TrackPointMarker } from "@entities/minimap";
import { useSelectedPolygons } from "@features/align-model";
import { MapItems } from "@kit/utils/MapItems";
import { UniqueItems } from "@kit/utils/UniqueItems";
import { Building } from "@entities/buildings";
import { RenderBuilding } from "@features/explore-view";

interface Props {
  buildings: Building[];
  onBuildingClick?: (building: Building, keys: KeyboardModifiers) => void;
}

export const ViewStage = ({ buildings, onBuildingClick }: Props) => {
  const { markers } = useMinimapMarkers();
  const { selectedPolygons } = useSelectedPolygons();

  const isHighlighted = (building: Building) =>
    Boolean(selectedPolygons.find((p) => p.id === building.id));

  return (
    <>
      <UniqueItems
        items={buildings}
        getKey={(building) => building.model}
        render={(building) => (
          <RenderBuilding
            key={building.model || building.id}
            building={building}
            highlighted={isHighlighted(building)}
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
