import { type ReactElement, useEffect } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import clsx from "clsx";
import classes from "./HoveringSideBar.module.css";

import { uiSlice } from "@slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";

export type SidebarState = "IDLE" | "HOVER" | "EXPANDED";

interface HoveringSideBarProps {
  children: ReactElement | ReactElement[];
  onStateChange?: (newState: SidebarState) => void;
}

export function HoveringSideBar({
  children,
  onStateChange = () => null,
}: HoveringSideBarProps) {
  const dispatch = useDispatch();
  const { getSidebarDisplay, getSidebarShowLabel } = uiSlice.selectors;
  const { setSidebarHidden, toggleSidebarExpanded } = uiSlice.actions;
  const display = useSelector(getSidebarDisplay);
  const isExpanded = useSelector(getSidebarShowLabel);

  useEffect(() => {
    onStateChange(display);
  }, [display]);

  const handleMouseEnter = () => {
    if (display === "IDLE") {
      dispatch(setSidebarHidden(false));
    }
  };

  const handleMouseLeave = () => {
    if (display !== "IDLE") {
      dispatch(setSidebarHidden(true));
    }
  };

  const handleToggle = () => {
    dispatch(toggleSidebarExpanded());
  };

  return (
    <nav
      className={clsx(classes.sidebar, classes[display.toLowerCase()])}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Боковое меню"
    >
      <button
        className={classes.toggleButton}
        onClick={handleToggle}
        aria-label={isExpanded ? "Свернуть меню" : "Развернуть меню"}
        title={isExpanded ? "Свернуть меню" : "Развернуть меню"}
      >
        {isExpanded ? (
          <FiChevronLeft size={20} />
        ) : (
          <FiChevronRight size={20} />
        )}
      </button>

      <ul className={classes.list}>{children}</ul>
    </nav>
  );
}
