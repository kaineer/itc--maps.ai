import { Button } from "@components/kit/Button";
import classes from "./TrackListItem.module.css";
import { Track } from "@.types/track-types";
import { useNotification } from "@hooks/useNotification";
import { useTracksApi } from "@entities/tracks/lib/use.tracks.api";
import { Link } from "react-router";
import { useTrack } from "@entities/tracks/lib/use.track";

interface Props {
  track: Track;
}

export const TrackListItem = ({ track }: Props) => {
  const { name } = track;
  const { route: trackRoute } = useTrack(track);
  const { deleteTrack } = useTracksApi();
  const { notify } = useNotification();

  const handleDelete = async () => {
    try {
      await deleteTrack(track.id).unwrap();
      notify("Экскурсия «" + name + "» удалена");
    } catch (err) {
      notify("Не удалось удалить экскурсию", err || new Error());
    }
  };

  return (
    <div className={classes.container}>
      <Link to={trackRoute} className={classes.link}>
        {name}
      </Link>
      <Button variation="red small" onClick={handleDelete}>
        Удалить
      </Button>
    </div>
  );
};
