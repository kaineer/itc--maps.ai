import classes from "./DummyNotification.module.css";
import { useViewMarkers } from "@hooks/useViewSlice";

export const MarkerNotification = () => {
  const { activeMarker } = useViewMarkers();

  if (!activeMarker) return null;

  return (
    <div className={classes.notification}>
      <h1 className={classes.title}>{activeMarker.name}</h1>

      {activeMarker.description}
    </div>
  );
};
