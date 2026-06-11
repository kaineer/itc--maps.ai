import classes from "./Button.module.css";
import { getVariationClasses } from "@utils/classes";
import clsx from "clsx";
import { ReactNode, MouseEvent } from "react";

interface Props {
  variation: string;
  children: ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({ variation, children, onClick }: Props) => {
  const handleClick = onClick || (() => null);
  const className = clsx(
    classes.button,
    getVariationClasses(variation, classes),
  );

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};
