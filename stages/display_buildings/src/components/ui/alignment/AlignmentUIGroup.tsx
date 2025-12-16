import { useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/slices/alignmentSlice";
import { TopCameraControlInfo } from "../../cameras/alignment/TopCameraControlInfo";
import { PerspectiveCameraControlInfo } from "../../cameras/alignment/PerspectiveCameraControlInfo";
import { Match } from "../../shared/Match";
import { EnabledProps } from "../../shared/types";
import { FinishAlignment } from "./FinishAlignment";

interface Props extends EnabledProps {
  className?: string;
}

/**
 * AlignmentUIGroup component for UI elements related to camera alignment.
 *
 * This component should be rendered OUTSIDE the Three.js Canvas because
 * it contains React components that use Redux and other React contexts
 * that are not available inside the Canvas context.
 *
 * Features:
 * - Shows control information panels based on current camera mode
 * - Can be extended to show other UI elements like status indicators
 * - Clean separation from 3D rendering components
 *
 * Usage:
 * ```tsx
 * // Outside Canvas:
 * <AlignmentUIGroup enabled={true} />
 *
 * // Inside Canvas:
 * <AlignmentCameraGroup enabled={true} />
 * ```
 */
export const AlignmentUIGroup = ({ enabled, className = "" }: Props) => {
  const { getCurrentCameraView } = alignmentSlice.selectors;
  const currentCameraView = useSelector(getCurrentCameraView);

  if (!enabled) {
    return null;
  }

  return (
    <div className={className}>
      <FinishAlignment onToggled={() => null} />
      <Match
        value={currentCameraView}
        top={() => <TopCameraControlInfo />}
        perspective={() => <PerspectiveCameraControlInfo />}
      />
    </div>
  );
};
