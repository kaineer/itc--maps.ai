import { type IconType } from "react-icons";
import classes from "./SideBarItem.module.css";
import { useNavigate } from "react-router";
import { uiSlice } from "@slices/uiSlice";
import { useSelector } from "react-redux";

interface Props {
  icon: IconType;
  label: string;
  displayWhen?: () => boolean;
  onClick?: () => void;
  url?: string;
}

export function SideBarItem({
  icon: Icon,
  label,
  displayWhen = () => true,
  onClick = () => null,
  url,
}: Props) {
  const navigate = useNavigate();

  const { getSidebarShowLabel } = uiSlice.selectors;
  const showLabel = useSelector(getSidebarShowLabel);

  const handleClick = () => {
    (url && navigate(url)) || onClick();
  };

  if (!displayWhen()) {
    return null;
  }

  return (
    <li>
      <button
        className={classes.item}
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
