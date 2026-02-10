import classes from "./Logout.module.css";
import { useAuthentication } from "@hooks/useAuthentication";

interface Props {
  enabled?: boolean;
}

export const Logout = ({ enabled = true }: Props) => {
  const { logout } = useAuthentication() || {};

  const handleClick = () => {
    if (logout) logout();
  };

  if (!enabled) return null;

  return <div className={classes.container} onClick={handleClick}></div>;
};
