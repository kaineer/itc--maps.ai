import { Button } from "@components/kit/Button";
import classes from "./TrackListItem.module.css";
import { Track } from "@.types/track-types";
import { useDeleteTrackMutation } from "@store/api/TracksApi";
import { toast } from "sonner";

interface Props {
  track: Track;
}

export const TrackListItem = ({ track }: Props) => {
  const { name } = track;
  const trackRoute = "/tracks/" + track.id;
  const [deleteItem] = useDeleteTrackMutation();

  const handleDelete = async () => {
    await deleteItem(track.id);
    toast.info("Экскурсия «" + name + "» удалена");
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
