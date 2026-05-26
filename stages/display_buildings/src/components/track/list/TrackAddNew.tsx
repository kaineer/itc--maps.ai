import classes from "./TrackListItem.module.css";
import clsx from "clsx";
import { useRef, useState, type KeyboardEvent } from "react";
import { useTracksApi } from "@entities/tracks/lib/use.tracks.api";
import { useNotification } from "@hooks/useNotification";

export const TrackAddNew = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");

  const { createTrack } = useTracksApi();
  const { notify } = useNotification();

  const handleKeydown = async (e: KeyboardEvent<HTMLInputElement>) => {
    setName(nameRef.current?.value || "");

    if (e.key === "Enter") {
      if (nameRef.current) {
        const name = nameRef.current.value;
        if (name) {
          nameRef.current.value = "";
          try {
            await createTrack({ name }).unwrap();

            notify("Создана экскурсия с именем «" + name + "»");
          } catch (err) {
            notify("Не удалось создать экскурсию", err || new Error());
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
      placeholder="Добавить экскурсию"
      className={clsx(classes.container, classes.input, {
        [classes.emptyInput]: name === "",
      })}
    />
  );
};
