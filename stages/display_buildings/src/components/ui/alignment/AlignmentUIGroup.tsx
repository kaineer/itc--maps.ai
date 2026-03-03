import { useSelector } from "react-redux";
import { alignmentSlice } from "@slices/alignmentSlice";
import { FinishAlignment } from "./FinishAlignment";
import { EnabledProps } from "@.types/component-types";
import { TopCameraControlInfo } from "@components/cameras/alignment/TopCameraControlInfo";
import { PerspectiveCameraControlInfo } from "@components/cameras/alignment/PerspectiveCameraControlInfo";
import { Match } from "@components/shared/Match";
import { ButtonsGroup } from "@components/kit/ButtonsGroup";

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
    <>
      <ButtonsGroup>
        <FinishAlignment onToggled={() => null} />
      </ButtonsGroup>
      <Match
        value={currentCameraView}
        top={() => <TopCameraControlInfo />}
        perspective={() => <PerspectiveCameraControlInfo />}
      />
    </>
  );
};
