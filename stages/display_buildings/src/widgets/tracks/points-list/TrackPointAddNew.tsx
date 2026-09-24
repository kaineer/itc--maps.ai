import classes from "./TrackPointListItem.module.css";
import clsx from "clsx";
import { useRef } from "react";
import { TrackId, TrackPoint } from "@.types/track-types";
import { useNotification } from "@hooks/useNotification";
import { useTrackPointsApi } from "@entities/tracks/lib/use.tracks.api";
import { bind } from "@utils/bind";

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
  const { createPoint } = useTrackPointsApi(trackId);
  const { notify } = useNotification();

  const handleKeydown = bind({
    Enter: async () => {
      if (nameRef.current) {
        const name = nameRef.current?.value || "";
        if (name) {
          nameRef.current.value = "";
          try {
            await createPoint(createPointWithName(name));
            notify("Создана точка экскурсии с именем «" + name + "»");
          } catch (err) {
            notify("Не удалось создать точку экскурсии", err || new Error());
          }
        }
      }
    },
  });

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
