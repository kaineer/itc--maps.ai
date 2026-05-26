import { Button } from "@components/kit/Button";
import classes from "./TrackListItem.module.css";
import { Track } from "@.types/track-types";
import { useNotification } from "@hooks/useNotification";
import { useDeleteTrackMutation } from "@entities/tracks/model/tracks.api";

interface Props {
  track: Track;
}

export const TrackListItem = ({ track }: Props) => {
  const { name } = track;
  const trackRoute = "/tracks/" + track.id;
  const [deleteItem] = useDeleteTrackMutation();
  const { notify } = useNotification();

  const handleDelete = async () => {
    try {
      await deleteItem(track.id).unwrap();
      notify("Экскурсия «" + name + "» удалена");
    } catch (err) {
      notify("Не удалось удалить экскурсию", err || new Error());
    }
  };

  return (
    <div className={classes.container}>
      <a href={trackRoute} className={classes.link}>
        {name}
      </a>
      <Button variation="red small" onClick={handleDelete}>
        Удалить
      </Button>
    </div>
  );
};
