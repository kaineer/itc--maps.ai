import { useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/alignmentSlice";
import { TopCameraController } from "./TopCameraController";
import { PerspectiveCameraController } from "./PerspectiveCameraController";
import { AlignmentSliceLogger } from "../../testing/ui/AlignmentSliceLogger";

interface Props {
  enabled: boolean;
  onCameraUpdate?: (camera: any) => void;
}

/**
 * AlignmentCameraGroup component that switches between camera modes based on Redux state.
 *
 * This component only contains 3D camera controllers that should be rendered inside Canvas.
 * For UI components (like control info), use AlignmentCameraUI component.
 *
 * When in "top" mode: Shows TopCameraController
 * When in "perspective" mode: Shows PerspectiveCameraController
 */
export const AlignmentCameraGroup = ({ enabled, onCameraUpdate }: Props) => {
  const { getCurrentCameraView } = alignmentSlice.selectors;
  const currentCameraView = useSelector(getCurrentCameraView);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {currentCameraView === "top" ? (
        // Top camera mode: Show top camera controller
        <TopCameraController enabled={true} onCameraUpdate={onCameraUpdate} />
      ) : (
        // Perspective camera mode: Show perspective controller
        <PerspectiveCameraController
          enabled={true}
          onCameraUpdate={onCameraUpdate}
        />
      )}

      {/* Alignment state logger for debugging */}
      <AlignmentSliceLogger
        enabled={true}
        logCameraState={true}
        logModelTransform={true}
        logStepConfig={true}
        logProcessState={true}
      />
    </>
  );
};
