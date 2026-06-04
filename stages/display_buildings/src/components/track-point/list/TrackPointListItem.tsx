import classes from "./TrackPointListItem.module.css";
import { Button } from "@components/kit/Button";
import type { TrackId, TrackPoint } from "@.types/track-types";
import { useDispatch } from "react-redux";
import { viewSlice } from "@slices/viewSlice";
import { useNavigate } from "react-router";
import { useNotification } from "@hooks/useNotification";
import { useRef, useState } from "react";
import { almostNone } from "@components/shared/positionMath";
import { useTrackPointsApi } from "@entities/tracks/lib/use.tracks.api";

const {
  setPointToAttach,
  updateCameraPosition,
  updateCameraTarget,
  setCameraPreset,
} = viewSlice.actions;

interface Props {
  trackId: TrackId;
  point: TrackPoint;
}

export const TrackPointListItem = ({ trackId, point }: Props) => {
  const { name } = point;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDescription, setShowDescription] = useState(false);
  const { notify } = useNotification();
  const { removePoint, updatePoint } = useTrackPointsApi(trackId);

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleDelete = async () => {
    try {
      await removePoint(point.id);
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

      try {
        await updatePoint({ ...point, description: newDescription });
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
