import { UniqueItems } from "@components/shared/UniqueItems";
import { Building } from "../../../types/types";
import { RenderBuilding } from "../../building/ui/RenderBuilding";
import { KeyboardModifiers } from "@utils/keyboardModifiers";
import { minimapSlice } from "@slices/minimapSlice";
import { MapItems } from "@components/shared/MapItems";
import { useSelector } from "react-redux";
import { TrackPointMarker } from "./TrackPointMarker";

interface Props {
  buildings: Building[];
  onBuildingClick?: (building: Building, keys: KeyboardModifiers) => void;
}

export const ViewStage = ({ buildings, onBuildingClick }: Props) => {
  const { getMarkers } = minimapSlice.selectors;
  const markers = useSelector(getMarkers);

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
