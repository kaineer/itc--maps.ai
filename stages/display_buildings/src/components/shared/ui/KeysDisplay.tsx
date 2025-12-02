import { Fragment } from "react";
import classes from "./KeysDisplay.module.css";

interface KeysDisplayProps {
  keys: string[];
  className?: string;
}

/**
 * KeysDisplay component for displaying keyboard shortcuts in a consistent way.
 *
 * Features:
 * - Consistent styling for all keyboard shortcuts
 * - Automatic + separator between keys
 * - Special handling for / as alternative separator
 * - Responsive design
 *
 * Usage:
 * ```tsx
 * <KeysDisplay keys={["Ctrl", "Space"]} />
 * <KeysDisplay keys={["W", "/", "S"]} />
 * <KeysDisplay keys={["Shift", "W", "A", "S", "D"]} />
 * ```
 */
export const KeysDisplay = ({ keys, className = "" }: KeysDisplayProps) => {
  return (
    <div className={`${classes.keysContainer} ${className}`}>
      {keys.map((key, keyIndex) => (
        <Fragment key={keyIndex}>
          {keyIndex > 0 && key !== "/" && keys[keyIndex - 1] !== "/" && (
            <span className={classes.keySeparator}>+</span>
          )}
          {key === "/" ? (
            <span className={classes.slashSeparator}>/</span>
          ) : (
            <kbd className={classes.key}>{key}</kbd>
          )}
        </Fragment>
      ))}
    </div>
  );
};
