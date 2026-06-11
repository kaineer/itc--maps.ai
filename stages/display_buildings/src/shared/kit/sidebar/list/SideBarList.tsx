import { type IconType } from "react-icons";
import classes from "./SideBarList.module.css";
import { useNavigate } from "react-router";
import { useState } from "react";
import { uiSlice } from "@slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";

interface SideBarListProps<T> {
  icon: IconType;
  displayWhen?: () => boolean;

  title: string;
  items: T[];
  limit?: number;
  getLabel: (item: T) => string;
  getUrl?: (item: T) => string;
  onClickItem?: (item: T) => void;
}

export function SideBarList<T>({
  icon: Icon,
  displayWhen,
  title,
  items,
  limit,
  getLabel,
  getUrl,
  onClickItem,
}: SideBarListProps<T>) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { getSidebarShowLabel } = uiSlice.selectors;
  const { setSidebarExpanded } = uiSlice.actions;
  const showLabel = useSelector(getSidebarShowLabel);
  const [showItems, setShowItems] = useState(true);

  if (typeof displayWhen === "function" && !displayWhen()) {
    return null;
  }

  const visibleItems =
    typeof limit === "undefined" ? items.slice(0, limit) : items;

  const handleItemClick =
    typeof getUrl === "function"
      ? (item: T) => navigate(getUrl(item))
      : typeof onClickItem === "function"
        ? onClickItem
        : () => null;

  const handleTitleClick = () => {
    if (!showLabel) {
      dispatch(setSidebarExpanded(true));
      setShowItems(true);
    } else {
      setShowItems((prev) => !prev);
    }
  };

  return (
    <li className={classes.listGroup}>
      <button
        className={classes.trigger}
        aria-label={title}
        title={title}
        onClick={handleTitleClick}
      >
        <Icon size={20} />
        {showLabel && <span className={classes.label}>{title}</span>}
      </button>

      {showLabel &&
        ((showItems && (
          <div className={classes.dropdown}>
            <ul className={classes.items}>
              {visibleItems.map((item, index) => (
                <li key={index}>
                  <button
                    className={classes.item}
                    onClick={() => handleItemClick(item)}
                  >
                    {getLabel(item)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )) || <div className={classes.dropdown}>...</div>)}
    </li>
  );
}
