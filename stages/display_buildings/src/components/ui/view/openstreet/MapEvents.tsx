import { viewSlice } from "@slices/viewSlice";
import { mercatorToMetrics } from "@utils/mercator";
import { useMapEvents } from "react-leaflet";
import { useDispatch } from "react-redux";

// Компонент для обработки кликов карты
export const MapEvents = () => {
  const dispatch = useDispatch();
  const { moveCameraToLocation } = viewSlice.actions;

  useMapEvents({
    click(e) {
      e.originalEvent.stopPropagation(); // Останавливаем всплытие оригинального события

      const { lat, lng } = e.latlng;
      const { x, z } = mercatorToMetrics(lng, lat);
      dispatch(moveCameraToLocation([-x, 0, z]));
    },
  });
  return null;
};
