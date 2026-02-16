import classes from "./RemoveButton.module.css";
import { MouseEvent } from "react";

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  description: string;
}

export const RemoveButton = ({ onClick, description }: Props) => (
  <button
    className={classes.removeButton}
    onClick={onClick}
    title="Удалить из списка"
    aria-label={description}
  >
    ×
  </button>
);
