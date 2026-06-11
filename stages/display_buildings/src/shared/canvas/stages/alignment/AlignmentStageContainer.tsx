import { EnabledProps } from "@.types/component-types";
import { AlignmentStage } from "./AlignmentStage";

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
  enabled,
  onBuildingClick,
}: Props) => {
  return <AlignmentStage enabled={enabled} onBuildingClick={onBuildingClick} />;
};
