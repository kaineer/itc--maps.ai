import classes from "./TrackPointListUI.module.css";

import { useGetTrackPointsQuery } from "@store/api/TracksApi";
import { useParams } from "react-router";
import { TrackPointAddNew } from "./TrackPointAddNew";
import { TrackPointListItem } from "./TrackPointListItem";
import { TrackPointsSideBar } from "@widgets/ui/tracks/sidebar/TrackPointsSideBar";

export const TrackPointListUI = () => {
  const { trackId } = useParams();
  const { data, isLoading } = useGetTrackPointsQuery(trackId || "");

  if (!trackId) return null;
  if (!data || isLoading) return null;

  return (
    <>
      <TrackPointsSideBar />
      <div className={classes.container}>
        <h1 className={classes.header}>Экскурсия: {data.name}</h1>
        <TrackPointAddNew trackId={trackId} />

        {data.points.map((point) => {
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
