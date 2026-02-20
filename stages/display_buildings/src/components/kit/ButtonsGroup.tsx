import classes from "./ButtonsGroup.module.css";
import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  anchor?: "topLeft" | "topRight";
}

export const ButtonsGroup = ({ children, anchor = "topLeft" }: Props) => {
  const className = clsx(classes.group, classes[anchor]);

  return <div className={className}>{children}</div>;
};
