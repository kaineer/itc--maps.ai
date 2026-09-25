import React from "react";
import { KeysDisplay } from "./KeysDisplay";
import classes from "./ControlInfoSection.module.css";

interface ControlItem {
  keys: string[];
  description: string;
}

interface Props {
  category: string;
  items: ControlItem[];
  className?: string;
}

/**
 * ControlInfoSection component for displaying a consistent section of control items.
 *
 * Features:
 * - Consistent styling for control sections across different control info panels
 * - Uses shared KeysDisplay component for keyboard shortcuts
 * - Responsive design
 * - Clean separation of concerns
 *
 * Usage:
 * ```tsx
 * <ControlInfoSection
 *   category="🎥 Camera Movement"
 *   items={[
 *     { keys: ["W", "A", "S", "D"], description: "Move camera" },
 *     { keys: ["Shift", "W"], description: "Move model" },
 *   ]}
 * />
 * ```
 */
export const ControlInfoSection = ({
  category,
  items,
  className = "",
}: Props) => {
  return (
    <div className={`${classes.section} ${className}`}>
      <h4 className={classes.sectionTitle}>{category}</h4>
      {items.map((item, itemIndex) => (
        <div key={itemIndex} className={classes.controlItem}>
          <KeysDisplay keys={item.keys} className={classes.keysDisplay} />
          <span className={classes.description}>{item.description}</span>
        </div>
      ))}
    </div>
  );
};
