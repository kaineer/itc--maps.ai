import { useSelector } from "react-redux";
import { alignmentSlice } from "@slices/alignmentSlice";
import { TopCameraController } from "./TopCameraController";
import { PerspectiveCameraController } from "./PerspectiveCameraController";
import { CameraUpdateProps, EnabledProps } from "@.types/component-types";
import { Match } from "@components/shared/Match";

interface Props extends EnabledProps, CameraUpdateProps {}

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
      <Match
        value={currentCameraView}
        top={() => (
          <TopCameraController enabled={true} onCameraUpdate={onCameraUpdate} />
        )}
        perspective={() => (
          <PerspectiveCameraController
            enabled={true}
            onCameraUpdate={onCameraUpdate}
          />
        )}
      />
    </>
  );
};
