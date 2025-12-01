import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uiSlice, KnownMode } from "../../../store/uiSlice";

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

  // Update local state when Redux state changes
  useEffect(() => {
    setIsKnownLocal(isKnownFromRedux);
  }, [isKnownFromRedux]);

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
        className={`collapsible-control-info collapsed ${className}`}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          cursor: "pointer",
        }}
        onClick={handleExpand}
        title="Click to show controls info"
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ?
        </div>
      </div>
    );
  }

  // Show full version
  return (
    <div
      className={`collapsible-control-info expanded ${className}`}
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 1000,
        maxWidth: "500px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          fontFamily: "monospace",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "20px",
            cursor: "pointer",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Hide controls (click ? to show again)"
        >
          ×
        </button>

        {/* Content */}
        <div style={{ paddingRight: "20px" }}>{children}</div>

        {/* Footer note */}
        <div
          style={{
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid #444",
            fontSize: "12px",
            color: "#888",
            textAlign: "center",
          }}
        >
          <div>Click × to hide. Click ? to show again.</div>
        </div>
      </div>
    </div>
  );
};
