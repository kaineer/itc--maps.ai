import classes from "./WorldMap.module.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ModelPosition } from "@.types/buildings-types";
import { metricsToMercator } from "@utils/mercator";
import { useEffect, useState } from "react";
import { LatLngExpression } from "leaflet";
import { MapEvents } from "./MapEvents";

interface Props {
  mapCenter?: ModelPosition;
  zoom?: number;
}

interface ChangeViewProps {
  center: LatLngExpression;
}

// Компонент для обновления центра
const ChangeView = ({ center }: ChangeViewProps) => {
  const map = useMap();
  const zoom = 13;

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map]);

  return null;
};

export const WorldMap = ({ mapCenter = [0, 0, 0], zoom = 13 }: Props) => {
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const [x, _, z] = mapCenter;
    const { lat, lon } = metricsToMercator(x, z);

    setCenter([lat, lon]);
  }, [mapCenter]);

  // const urlTemplate = "https://tile.openstreetmap.org/{z}/{x}/{y}.png" as const;
  const urlTemplate = "http://10.1.0.71:3000/osm_tiles/{z}/{x}/{y}.png";

  return (
    <div className={classes.container}>
      <MapContainer center={center} zoom={zoom} className={classes.map}>
        <TileLayer
          url={urlTemplate}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ChangeView center={center} />
        <MapEvents />
      </MapContainer>
    </div>
  );
};
