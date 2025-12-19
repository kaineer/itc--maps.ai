import { useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/slices/alignmentSlice";
import { AlignmentStage } from "./AlignmentStage";
import { EnabledProps } from "../../shared/types";

interface Props extends EnabledProps {
  /**
   * Optional callback when a building polygon is clicked
   */
  onBuildingClick?: (building: any) => void;
}

/**
 * AlignmentStageContainer component that connects AlignmentStage to Redux state.
 *
 * This container component:
 * 1. Reads selected polygons from Redux state (selectedPolygons)
 * 2. Passes them to AlignmentStage component
 * 3. Provides a clean separation between Redux logic and rendering logic
 *
 * The actual alignment model rendering is handled by AlignmentModel component
 * inside AlignmentStage, which reads currentModel and modelTransform from Redux.
 */
export const AlignmentStageContainer = ({
  enabled = true,
  onBuildingClick,
}: Props) => {
  const { getSelectedPolygons } = alignmentSlice.selectors;
  const selectedPolygons = useSelector(getSelectedPolygons);

  return (
    <AlignmentStage
      enabled={enabled}
      selectedPolygons={selectedPolygons}
      onBuildingClick={onBuildingClick}
    />
  );
};
