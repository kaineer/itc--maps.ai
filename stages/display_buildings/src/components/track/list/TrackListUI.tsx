import type { Track } from "@.types/track-types";
import classes from "./TrackListUI.module.css";
import { TrackListItem } from "./TrackListItem";
import { TrackAddNew } from "./TrackAddNew";
import { TracksSideBar } from "@widgets/tracks/sidebar/TracksSideBar";
import { useTracksApi } from "@entities/tracks/lib/use.tracks.api";

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
