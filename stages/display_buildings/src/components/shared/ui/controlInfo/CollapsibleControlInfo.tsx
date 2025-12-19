import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import classes from "./CollapsibleControlInfo.module.css";
import {
  helpInfoSlice,
  KnownMode,
} from "../../../../store/slices/helpInfoSlice";

interface Props {
  mode: KnownMode;
  children: React.ReactNode;
  className?: string;
}

export const CollapsibleControlInfo = ({
  mode,
  children,
  className = "",
}: Props) => {
  const dispatch = useDispatch();
  const { getKnown } = helpInfoSlice.selectors;
  const { setKnown } = helpInfoSlice.actions;

  const known = useSelector(getKnown);
  const isKnownFromRedux = known[mode];

  // Local state that can be temporarily overridden
  const [isKnownLocal, setIsKnownLocal] = useState(isKnownFromRedux);

  const handleClose = () => {
    dispatch(setKnown(mode));
    setIsKnownLocal(true);
  };

  const handleExpand = () => {
    // Temporarily show the expanded version without changing Redux state
    setIsKnownLocal(false);
  };

  // If the mode is known (user has closed it), show collapsed version
  if (isKnownLocal) {
    return (
      <div
        className={clsx(classes.container, classes.collapsed, className)}
        onClick={handleExpand}
        title="Click to show controls info"
      >
        <button className={classes.collapsedButton}>?</button>
      </div>
    );
  }

  // Show full version
  return (
    <div className={clsx(classes.container, classes.expanded, className)}>
      <div className={classes.panel}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className={classes.closeButton}
          title="Hide controls (click ? to show again)"
        >
          ×
        </button>

        {/* Content */}
        <div className={classes.content}>{children}</div>

        {/* Footer note */}
        <div className={classes.footer}>
          <div>Click × to hide. Click ? to show again.</div>
        </div>
      </div>
    </div>
  );
};
