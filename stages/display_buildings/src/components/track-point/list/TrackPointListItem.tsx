import { Button } from "@components/kit/Button";
import classes from "./TrackPointListItem.module.css";
import type { TrackId, TrackPoint } from "@.types/track-types";
import {
  useDeleteTrackPointMutation,
  usePutTrackPointMutation,
} from "@store/api/TracksApi";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { viewSlice } from "@slices/viewSlice";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import { almostNone } from "@components/shared/positionMath";

interface Props {
  trackId: TrackId;
  point: TrackPoint;
}

export const TrackPointListItem = ({ trackId, point }: Props) => {
  const { name } = point;
  const [deleteItem] = useDeleteTrackPointMutation();
  const [updatePoint] = usePutTrackPointMutation();
  const [showDescription, setShowDescription] = useState(false);
  const dispatch = useDispatch();
  const {
    setPointToAttach,
    updateCameraPosition,
    updateCameraTarget,
    setCameraPreset,
  } = viewSlice.actions;
  const navigate = useNavigate();

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleDelete = async () => {
    await deleteItem({ trackId, id: point.id });
    toast.info("Точка «" + name + "» удалена");
  };

  const handleAttach = () => {
    dispatch(setPointToAttach({ trackId, point }));

    if (!almostNone(point.position)) {
      dispatch(setCameraPreset());
      dispatch(updateCameraPosition(point.position));
      dispatch(updateCameraTarget(point.targetPosition));
    }

    navigate("/view");
  };

  const handleDescription = () => {
    setShowDescription((prev) => !prev);
  };

  const handleSaveDescription = async () => {
    if (descriptionRef.current) {
      const newDescription = descriptionRef.current.value;

      const updatedPoint = { ...point, trackId, description: newDescription };

      await updatePoint(updatedPoint);
      toast.info("Описание точки сохранено");
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.firstRow}>
        <div className={classes.content}>{name}</div>
        <Button variation="green small" onClick={handleAttach}>
          Привязка
        </Button>
        <Button variation="black small" onClick={handleDescription}>
          Описание
        </Button>
        <Button variation="red small" onClick={handleDelete}>
          Удалить
        </Button>
      </div>
      {showDescription && (
        <div className={classes.secondRow}>
          <textarea
            ref={descriptionRef}
            defaultValue={point.description}
          ></textarea>
          <Button variation="black small" onClick={handleSaveDescription}>
            Сохранить
          </Button>
        </div>
      )}
    </div>
  );
};
