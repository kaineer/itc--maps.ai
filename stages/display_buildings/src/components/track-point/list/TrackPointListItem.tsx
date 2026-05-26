import { Button } from "@components/kit/Button";
import classes from "./TrackPointListItem.module.css";
import type { TrackId, TrackPoint } from "@.types/track-types";
import { useDispatch } from "react-redux";
import { viewSlice } from "@slices/viewSlice";
import { useNavigate } from "react-router";
import { useNotification } from "@hooks/useNotification";
import { useRef, useState } from "react";
import { almostNone } from "@components/shared/positionMath";
import {
  useDeleteTrackPointMutation,
  usePutTrackPointMutation,
} from "@entities/tracks/model/tracks.api";

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
  const { notify } = useNotification();

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleDelete = async () => {
    try {
      await deleteItem({ trackId, id: point.id }).unwrap();
      notify("Точка «" + name + "» удалена");
    } catch (err) {
      notify("Не удалось удалить точку", err || new Error());
    }
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

      try {
        await updatePoint(updatedPoint).unwrap();
        notify("Описание точки сохранено");
      } catch (err) {
        notify("Не удалось изменить описание точки", err || new Error());
      }
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
