import classes from "./Container.module.css";
import { ReactNode } from "react";

interface Props {
  gap?: number;
  children: ReactNode;
}

const px = (value: number | string) => String(value) + "px";

type StyleProps = Pick<Required<Props>, "gap">;

const buildStyle = ({ gap }: StyleProps) => {
  return {
    gap: px(gap),
  };
};

type ContainerType = "row" | "column";

const Container =
  (name: ContainerType) =>
  ({ gap = 8, children }: Props) => {
    const style = buildStyle({ gap });

    return (
      <div className={classes[name]} style={style}>
        {children}
      </div>
    );
  };

export const Row = Container("row");
export const Column = Container("column");
