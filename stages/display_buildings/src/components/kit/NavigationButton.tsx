import { useNavigate } from "react-router";
import classes from "./NavigationButton.module.css";
import { ReactNode, MouseEvent } from "react";

interface Props {
  children: ReactNode;
  route?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  enabled?: boolean;
  title?: string;
}

export const NavigationButton = ({
  children,
  route,
  onClick,
  enabled,
  title,
}: Props) => {
  const navigate = useNavigate();

  if (typeof enabled === "boolean" && !enabled) return null;

  const handleClick =
    typeof route === "string" ? () => navigate(route) : onClick;

  return (
    <div className={classes.container} onClick={handleClick} title={title}>
      {children}
    </div>
  );
};
