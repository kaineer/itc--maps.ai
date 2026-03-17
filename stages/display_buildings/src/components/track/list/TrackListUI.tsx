import type { Track } from "@.types/track-types";
import classes from "./TrackListUI.module.css";
import { useGetTracksListQuery } from "@store/api/TracksApi";
import { TrackListItem } from "./TrackListItem";
import { TrackAddNew } from "./TrackAddNew";

export const TrackListUI = () => {
  const { data, isLoading } = useGetTracksListQuery();

  if (!data || isLoading) return null;

  return (
    <>
      <div className={classes.container}>
        <h1 className={classes.header}>Экскурсии</h1>
        <TrackAddNew />
        {data.map((track: Track) => (
          <TrackListItem track={track} />
        ))}
      </div>
    </>
  );
};
