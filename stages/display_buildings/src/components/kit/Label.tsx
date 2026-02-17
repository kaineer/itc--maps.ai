import classes from "./Label.module.css";
import { ReactNode, MouseEvent, RefObject } from "react";

interface Props {
  children: ReactNode;
  inputRef?: RefObject<HTMLInputElement>;
}

export const Label = ({ children, inputRef }: Props) => {
  const handleClick = inputRef
    ? (e: MouseEvent<HTMLDivElement>) => {
        if (inputRef?.current) {
          e.preventDefault();
          e.stopPropagation();

          inputRef.current.focus();
        }
      }
    : () => null;

  return (
    <div className={classes.container} onClick={handleClick}>
      {children}
    </div>
  );
};
