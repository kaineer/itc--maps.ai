import classes from "./LoggingInfoFooter.module.css";

/**
 * LoggingInfoFooter component for displaying consistent footer information
 * about console logging and state monitoring in control info panels.
 *
 * Features:
 * - Consistent styling for logging information
 * - Can be used in development mode only
 * - Provides helpful information about debugging capabilities
 *
 * Usage:
 * ```tsx
 * <LoggingInfoFooter />
 * ```
 */
export const LoggingInfoFooter = () => {
  return (
    <div className={classes.footer}>
      <div className={classes.footerText}>
        All changes are logged in console
      </div>
      <div className={classes.footerText}>
        Use AlignmentSliceLogger for detailed state monitoring
      </div>
    </div>
  );
};
