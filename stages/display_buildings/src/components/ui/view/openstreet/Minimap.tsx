import classes from "./Minimap.module.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ModelPosition } from "@.types/buildings-types";
import { metricsToMercator } from "@utils/mercator";
import { useEffect } from "react";
import { LatLngExpression } from "leaflet";
import { MapEvents } from "./MapEvents";
import { minimapSlice } from "@slices/minimapSlice";
import { useDispatch, useSelector } from "react-redux";

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

  const { getZoom, getCenter } = minimapSlice.selectors;
  const { setCenter } = minimapSlice.actions;

  const zoom = useSelector(getZoom);
  const center = useSelector(getCenter);

  useEffect(() => {
    const [x, _, z] = mapCenter;
    const { lat, lon } = metricsToMercator(x, z);

    if (lat !== center[0] && lon !== center[1]) {
      dispatch(setCenter([lat, lon]));
    }
  }, [mapCenter, center]);

  // const urlTemplate = "https://tile.openstreetmap.org/{z}/{x}/{y}.png" as const;
  const urlTemplate = "http://10.1.0.71:3000/osm_tiles/{z}/{x}/{y}.png";

  return (
    <div className={classes.container}>
      <MapContainer center={center} zoom={zoom} className={classes.map}>
        <TileLayer
          url={urlTemplate}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ChangeView center={center} zoom={zoom} />
        <MapEvents />
      </MapContainer>
    </div>
  );
};
