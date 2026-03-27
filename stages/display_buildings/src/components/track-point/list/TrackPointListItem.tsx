import { Button } from "@components/kit/Button";
import classes from "./TrackPointListItem.module.css";
import type { TrackId, TrackPoint } from "@.types/track-types";
import { useDeleteTrackPointMutation } from "@store/api/TracksApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { viewSlice } from "@slices/viewSlice";

interface Props {
  trackId: TrackId;
  point: TrackPoint;
}

export const TrackPointListItem = ({ trackId, point }: Props) => {
  const { name } = point;
  const [deleteItem] = useDeleteTrackPointMutation();
  const dispatch = useDispatch();
  const { setPointToAttach } = viewSlice.actions;
  const navigate = useNavigate();

  const handleDelete = async () => {
    await deleteItem({ trackId, id: point.id });
    toast.info("Точка «" + name + "» удалена");
  };

  const handleAttach = () => {
    dispatch(setPointToAttach(point.id));
    navigate("/view");
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>{name}</div>
      <Button variation="green small" onClick={handleAttach}>
        Привязка
      </Button>
      <Button variation="red small" onClick={handleDelete}>
        Удалить
      </Button>
    </div>
  );
};
