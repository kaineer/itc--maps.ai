import classes from "./TrackPointListUI.module.css";

import { useParams } from "react-router";
import { TrackPointAddNew } from "./TrackPointAddNew";
import { TrackPointListItem } from "./TrackPointListItem";
import { TrackPointsSideBar } from "@widgets/ui/tracks/sidebar/TrackPointsSideBar";
import { useTrackPointsApi } from "@entities/tracks/lib/use.tracks.api";

export const TrackPointListUI = () => {
  const { trackId } = useParams();
  const { points, name } = useTrackPointsApi(trackId);

  if (!trackId) return null;

  return (
    <>
      <TrackPointsSideBar />
      <div className={classes.container}>
        <h1 className={classes.header}>Экскурсия: {name}</h1>
        <TrackPointAddNew trackId={trackId} />

        {points.map((point) => {
          return (
            <TrackPointListItem
              key={point.id}
              trackId={trackId}
              point={point}
            />
          );
        })}
      </div>
    </>
  );
};
