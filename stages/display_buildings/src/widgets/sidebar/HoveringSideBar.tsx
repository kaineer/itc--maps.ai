import { useState, cloneElement, type ReactElement } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import clsx from "clsx";
import classes from "./HoveringSideBar.module.css";

export type SidebarState = "IDLE" | "HOVER" | "EXPANDED";

interface HoveringSideBarProps {
  children: ReactElement | ReactElement[];
  initialState?: SidebarState;
  onStateChange?: (newState: SidebarState) => void;
}

export function HoveringSideBar({
  children,
  initialState = "IDLE",
  onStateChange = () => null,
}: HoveringSideBarProps) {
  const [display, setDisplay] = useState<SidebarState>(initialState);

  const handleStateChange = (newState: SidebarState) => {
    onStateChange(newState);
    setDisplay(newState);
  };

  const isExpanded = display === "EXPANDED";

  const handleMouseEnter = () => {
    if (display === "IDLE") {
      handleStateChange("HOVER");
    }
  };

  const handleMouseLeave = () => {
    if (display !== "IDLE") {
      handleStateChange("IDLE");
    }
  };

  const handleToggle = () => {
    handleStateChange(display === "EXPANDED" ? "HOVER" : "EXPANDED");
  };

  const childrenArray = Array.isArray(children) ? children : [children];

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

      <ul className={classes.list}>
        {childrenArray
          .filter((child) => !!child)
          .map((child) => cloneElement(child, { display }))}
      </ul>
    </nav>
  );
}
