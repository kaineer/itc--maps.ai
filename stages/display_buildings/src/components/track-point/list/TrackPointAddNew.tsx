import classes from "./TrackPointListItem.module.css";
import clsx from "clsx";
import { useRef, type KeyboardEvent } from "react";
import { TrackId, TrackPoint } from "@.types/track-types";
import { useNotification } from "@hooks/useNotification";
import { usePostTrackPointMutation } from "@entities/tracks/model/tracks.api";

interface Props {
  trackId: TrackId;
}

const createPointWithName = (name: string): Omit<TrackPoint, "id"> => {
  return {
    name,
    type: "checkpoint",
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    targetPosition: [0, 0, 0],
    description: "",
    rotationRestricted: true,
    tiltRestricted: true,
    movementRestricted: true,
  };
};

export const TrackPointAddNew = ({ trackId }: Props) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [createPoint] = usePostTrackPointMutation();
  const { notify } = useNotification();

  const handleKeydown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (nameRef.current) {
        const name = nameRef.current?.value || "";
        if (name) {
          nameRef.current.value = "";
          try {
            await createPoint({
              trackId,
              ...createPointWithName(name),
            }).unwrap();
            notify("Создана точка экскурсии с именем «" + name + "»");
          } catch (err) {
            notify("Не удалось создать точку экскурсии", err || new Error());
          }
        }
      }
    }
  };

  return (
    <input
      ref={nameRef}
      onKeyDown={handleKeydown}
      type="text"
      placeholder="Добавить точку"
      className={clsx(classes.container, classes.input)}
    />
  );
};
