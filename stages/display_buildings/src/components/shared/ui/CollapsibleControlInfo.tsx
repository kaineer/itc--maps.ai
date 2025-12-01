import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiSlice, KnownMode } from "../../../store/uiSlice";
import styles from "./CollapsibleControlInfo.module.css";

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
  const { getKnown } = uiSlice.selectors;
  const { setKnown } = uiSlice.actions;

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
        className={`${styles.container} ${styles.collapsed} ${className}`}
        onClick={handleExpand}
        title="Click to show controls info"
      >
        <button className={styles.collapsedButton}>?</button>
      </div>
    );
  }

  // Show full version
  return (
    <div className={`${styles.container} ${styles.expanded} ${className}`}>
      <div className={styles.panel}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className={styles.closeButton}
          title="Hide controls (click ? to show again)"
        >
          ×
        </button>

        {/* Content */}
        <div className={styles.content}>{children}</div>

        {/* Footer note */}
        <div className={styles.footer}>
          <div>Click × to hide. Click ? to show again.</div>
        </div>
      </div>
    </div>
  );
};
