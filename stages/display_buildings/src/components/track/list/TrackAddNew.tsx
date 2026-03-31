import clsx from "clsx";
import classes from "./TrackListItem.module.css";
import { useRef, useState, type KeyboardEvent } from "react";
import { usePostTrackMutation } from "@store/api/TracksApi";
import { toast } from "sonner";

export const TrackAddNew = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [createTrack] = usePostTrackMutation();
  const [name, setName] = useState("");

  const handleKeydown = async (e: KeyboardEvent<HTMLInputElement>) => {
    setName(nameRef.current?.value || "");

    if (e.key === "Enter") {
      if (nameRef.current) {
        const name = nameRef.current.value;
        if (name) {
          nameRef.current.value = "";
          await createTrack({ name });

          toast.info("Создана экскурсия с именем «" + name + "»");
        }
      }
    }
  };

  return (
    <input
      ref={nameRef}
      onKeyDown={handleKeydown}
      type="text"
      placeholder="Добавить экскурсию"
      className={clsx(classes.container, classes.input, {
        [classes.emptyInput]: name === "",
      })}
    />
  );
};
