import classes from "./Minimap.module.css";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ModelPosition } from "@.types/buildings-types";
import { metricsToMercator } from "@utils/mercator";
import { useEffect } from "react";
import { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { MapEvents } from "./MapEvents";
import { MarkerPoint, minimapSlice } from "@slices/minimapSlice";
import { useDispatch } from "react-redux";
import { leafletTemplate } from "@utils/network";
import { distance2dBetween } from "@shared/lib/position/positionMath";
import { DISTANCES } from "@utils/constants";

import L from "leaflet";
// ✅ Правильное исправление иконок для react-leaflet 5.x
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { viewSlice } from "@slices/viewSlice";
import { useNotification } from "@hooks/useNotification";
import { useLazyQueryTrackPointsQuery } from "@entities/tracks/model/tracks.api";
import {
  useMinimapMarkers,
  useMinimapPosition,
} from "@entities/minimap/lib/use.minimap.slice";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface Props {
  mapCenter?: ModelPosition;
}

interface ChangeViewProps {
  center: LatLngExpression;
  zoom: number;
}

// Компонент для обновления центра
const ChangeView = ({ center, zoom }: ChangeViewProps) => {
  const map = useMap();

  useEffect(() => {
    map.setZoom(zoom);
  }, [zoom, map]);

  useEffect(() => {
    map.panTo(center);
  }, [center, map]);

  return null;
};

export const Minimap = ({ mapCenter = [0, 0, 0] }: Props) => {
  const dispatch = useDispatch();
  const { notify } = useNotification();

  const { zoom, center, lastLoadedCenter } = useMinimapPosition();
  const { markers } = useMinimapMarkers();

  const { setCenter, setLastLoadedCenter, setMarkers } = minimapSlice.actions;
  const { moveCameraToLocation, updateCameraTarget } = viewSlice.actions;

  const [fetchTrackPoints] = useLazyQueryTrackPointsQuery();

  const getMarker = (obj: unknown): MarkerPoint | null => {
    if (
      typeof obj === "object" &&
      obj !== null &&
      "position" in obj &&
      "targetPosition" in obj &&
      "name" in obj &&
      "description" in obj
    ) {
      const [x, _, z] = obj.position as ModelPosition;
      const { lat, lon } = metricsToMercator(x, z);
      const name = String(obj.name);

      return {
        lat,
        lon,
        name,
        position: obj.position as ModelPosition,
        target: obj.targetPosition as ModelPosition,
        description: obj.description as string,
      };
    }
    return null;
  };

  useEffect(() => {
    const [x, _, z] = mapCenter;
    const { lat, lon } = metricsToMercator(x, z);

    if (lat !== center[0] && lon !== center[1]) {
      dispatch(setCenter([lat, lon]));
    }
  }, [mapCenter, center]);

  useEffect(() => {
    const distance = distance2dBetween(mapCenter, lastLoadedCenter);
    if (distance > DISTANCES.LAST_LOADED_CAMERA_DISTANCE) {
      const [x, _, z] = mapCenter;
      fetchTrackPoints({
        position: { x, z },
        distance: 100000, // DISTANCES.BUILDING_DISTANCE,
      }).then(({ data }) => {
        dispatch(
          setMarkers((data || []).map(getMarker).filter((m) => m !== null)),
        );
      });
      dispatch(setLastLoadedCenter(mapCenter));
    }
  }, [mapCenter, lastLoadedCenter]);

  const handleMarker = (marker: MarkerPoint) => (e: LeafletMouseEvent) => {
    e.originalEvent.stopPropagation();
    const { position, target, name } = marker;
    notify("Переход к маркеру " + name);

    dispatch(moveCameraToLocation(position));
    dispatch(updateCameraTarget(target));
  };

  return (
    <div className={classes.container}>
      <MapContainer center={center} zoom={zoom} className={classes.map}>
        <TileLayer
          url={leafletTemplate}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ChangeView center={center} zoom={zoom} />
        <MapEvents />
        {markers.map((marker) => (
          <Marker
            key={marker.name}
            position={[marker.lat, marker.lon]}
            eventHandlers={{
              click: handleMarker(marker),
            }}
          ></Marker>
        ))}
      </MapContainer>
    </div>
  );
};
