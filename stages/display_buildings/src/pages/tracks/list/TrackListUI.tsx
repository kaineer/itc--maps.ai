import classes from "./TrackListUI.module.css";
import type { Track } from "@.types/track-types";
import { TracksSideBar } from "@widgets/tracks/sidebar/TracksSideBar";
import { useTracksApi } from "@entities/tracks/lib/use.tracks.api";
import { TrackAddNew } from "@widgets/tracks/list/TrackAddNew";
import { TrackListItem } from "@widgets/tracks/list/TrackListItem";

export const TrackListUI = () => {
  const { tracks, isTracksLoading } = useTracksApi();

  if (!tracks || isTracksLoading) return null;

  return (
    <>
      <TracksSideBar />
      <div className={classes.container}>
        <h1 className={classes.header}>Экскурсии</h1>
        <TrackAddNew />
        {tracks.map((track: Track) => (
          <TrackListItem track={track} />
        ))}
      </div>
    </>
  );
};
