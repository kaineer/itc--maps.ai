import classes from "./StartAlignmentButton.module.css";
import { MouseEvent } from "react";

interface Props {
  className?: string;
  onClick?: () => void;
}

export const StartAlignmentButton = ({
  className = "",
  onClick = () => null,
}: Props) => {
  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick();
  };

  return (
    <div className={`${classes.container} ${className}`}>
      <button
        type="button"
        onClick={handleButtonClick}
        className={classes.startButton}
      >
        Начать выравнивание
      </button>
    </div>
  );
};
