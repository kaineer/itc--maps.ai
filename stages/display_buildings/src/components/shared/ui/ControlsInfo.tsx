import React from "react";

interface ControlsInfoProps {
  className?: string;
}

const ControlsInfo: React.FC<ControlsInfoProps> = ({ className = "" }) => {
  return (
    <div className={`controls-info ${className}`}>
      <h3>Controls</h3>
      <p>
        <strong>W</strong> - Move forward
      </p>
      <p>
        <strong>S</strong> - Move backward
      </p>

      <p>
        <strong>Mouse + Left Click</strong> - Rotate camera
      </p>
      <p>Camera height is fixed at 1.8m</p>
    </div>
  );
};

export { ControlsInfo };
