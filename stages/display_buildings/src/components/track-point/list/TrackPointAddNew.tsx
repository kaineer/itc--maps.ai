import clsx from "clsx";
import classes from "./TrackPointListItem.module.css";
import { useRef, type KeyboardEvent } from "react";
import { usePostTrackPointMutation } from "@store/api/TracksApi";
import { toast } from "sonner";
import { TrackId, TrackPoint } from "@.types/track-types";

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

  const handleKeydown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (nameRef.current) {
        const name = nameRef.current?.value || "";
        if (name) {
          nameRef.current.value = "";
          await createPoint({ trackId, ...createPointWithName(name) });

          toast.info("Создана точка экскурсии с именем «" + name + "»");
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
