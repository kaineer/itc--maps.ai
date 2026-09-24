import classes from "./MarkerNotification.module.css";
import { useViewMarkers } from "@features/explore-view";

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
