import { EnabledProps } from "../../shared/types";
import styles from "./ViewControlsInfo.module.css";

interface Props extends EnabledProps {
  className?: string;
}

/**
 * ViewControlsInfo component for displaying control information in View mode.
 *
 * This component shows the keyboard and mouse controls specific to the View mode,
 * where users can navigate the 3D environment using WASD keys and mouse controls.
 *
 * The controls information is relevant to:
 * - ViewCameraController (WASD movement)
 * - OrbitControls (mouse rotation/pan/zoom)
 * - Fixed camera height at 1.8m (eye level)
 */
export const ViewControlsInfo = ({ enabled = true, className = "" }: Props) => {
  if (!enabled) {
    return null;
  }

  return (
    <div className={`${styles.viewControlsInfo} ${className}`}>
      <h3>View Mode Controls</h3>

      <div className={styles.controlsSection}>
        <h4>Movement</h4>
        <p>
          <strong>W</strong> - Move forward
        </p>
        <p>
          <strong>S</strong> - Move backward
        </p>
        <p>
          <strong>A</strong> - Move left
        </p>
        <p>
          <strong>D</strong> - Move right
        </p>
      </div>

      <div className={styles.controlsSection}>
        <h4>Camera</h4>
        <p>
          <strong>Mouse + Left Click + Drag</strong> - Rotate camera
        </p>
        <p>
          <strong>Mouse + Right Click + Drag</strong> - Pan camera
        </p>
        <p>
          <strong>Mouse Wheel</strong> - Zoom in/out
        </p>
        <p>Camera height is fixed at 1.8m (eye level)</p>
      </div>

      <div className={styles.controlsSection}>
        <h4>Navigation</h4>
        <p>Use WASD keys to move around the scene</p>
        <p>Combine with mouse controls for full navigation</p>
      </div>
    </div>
  );
};
