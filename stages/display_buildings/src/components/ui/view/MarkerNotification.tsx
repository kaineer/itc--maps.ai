import classes from "./DummyNotification.module.css";
import { viewSlice } from "@slices/viewSlice";
import { useSelector } from "react-redux";

export const MarkerNotification = () => {
  const { getActiveMarker } = viewSlice.selectors;
  const activeMarker = useSelector(getActiveMarker);

  if (!activeMarker) return null;

  return (
    <div className={classes.notification}>
      <h1 className={classes.title}>{activeMarker.name}</h1>

      {activeMarker.description}
    </div>
  );
};
