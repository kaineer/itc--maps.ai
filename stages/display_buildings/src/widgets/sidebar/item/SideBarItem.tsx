import { type IconType } from "react-icons";
import clsx from "clsx";
import type { SidebarState } from "../HoveringSideBar";
import classes from "./SideBarItem.module.css";
import { useNavigate } from "react-router";

interface Props {
  icon: IconType;
  label: string;
  display: SidebarState;
  displayWhen?: () => boolean;
  onClick?: () => void;
  url?: string;
  active?: boolean;
}

export function SideBarItem({
  icon: Icon,
  label,
  display,
  displayWhen = () => true,
  onClick = () => null,
  url,
  active = false,
}: Props) {
  const navigate = useNavigate();
  const showLabel = display === "EXPANDED";

  const handleClick = () => {
    (url && navigate(url)) || onClick();
  };

  if (!displayWhen()) {
    return null;
  }

  return (
    <li>
      <button
        className={clsx(classes.item, active && classes.active)}
        onClick={handleClick}
        aria-label={label}
        title={label}
      >
        <Icon size={20} />
        {showLabel && <span className={classes.label}>{label}</span>}
      </button>
    </li>
  );
}
