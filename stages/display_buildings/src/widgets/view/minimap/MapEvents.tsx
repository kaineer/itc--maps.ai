import { minimapSlice } from "@slices/minimapSlice";
import { viewSlice } from "@slices/viewSlice";
import { mercatorToMetrics } from "@utils/mercator";
import { useMapEvents } from "react-leaflet";
import { useDispatch } from "react-redux";

// Компонент для обработки кликов карты
export const MapEvents = () => {
  const dispatch = useDispatch();
  const { moveCameraToLocation } = viewSlice.actions;
  const { setZoom } = minimapSlice.actions;

  useMapEvents({
    click(e) {
      e.originalEvent.stopPropagation(); // Останавливаем всплытие оригинального события

      const { lat, lng } = e.latlng;
      const { x, z } = mercatorToMetrics(lng, lat);
      dispatch(moveCameraToLocation([-x, 0, z]));
    },
    zoomend(e) {
      const map = e.target;
      const newZoom = map.getZoom();
      dispatch(setZoom(newZoom));
    },
  });
  return null;
};
