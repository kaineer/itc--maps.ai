import classes from "./Logout.module.css";
import { MouseEvent } from "react";
import { useAuthentication } from "@hooks/useAuthentication";
import { IoIosLogOut } from "react-icons/io";

interface Props {
  enabled?: boolean;
}

export const Logout = ({ enabled = true }: Props) => {
  const { logout } = useAuthentication();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (logout) logout();
  };

  if (!enabled) return null;

  return (
    <div className={classes.container} onClick={handleClick}>
      <IoIosLogOut />
    </div>
  );
};
