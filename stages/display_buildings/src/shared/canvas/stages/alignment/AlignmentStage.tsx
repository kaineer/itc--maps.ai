import { TransparentPolygonBuilding } from "@canvas/buildings/alignment/TransparentPolygonBuilding";
import { useSelectedPolygons } from "@hooks/alignment/useAlignmentSlice";
import { AlignmentModel } from "@canvas/buildings/alignment/AlignmentModel";
import type { Building, EnabledProps } from "@.types/types";

interface Props extends EnabledProps {
  /**
   * Optional callback when a building polygon is clicked
   */
  onBuildingClick?: (building: Building) => void;
}

/**
 * AlignmentStage component for the alignment UI mode.
 *
 * This component renders:
 * 1. Transparent polygons of selected buildings for visual reference
 * 2. The alignment model (from Redux state) positioned and transformed according to alignment process
 *
 * Usage in AlignmentUI:
 * - Selected polygons come from Redux state (selectedPolygons)
 * - Alignment model is rendered by AlignmentModel component which reads from Redux
 * - This component should be rendered inside Three.js Canvas
 *
 * The alignment model is positioned with its bottom face center at modelTransform.position,
 * matching how real 3D models should be positioned (bottom face on ground).
 */
export const AlignmentStage = ({ enabled = true, onBuildingClick }: Props) => {
  const { selectedPolygons } = useSelectedPolygons();

  if (!enabled) return null;

  return (
    <>
      {/* Render selected building polygons as transparent references */}
      {selectedPolygons.map((building) => (
        <group
          key={`${building.address}-${building.position?.x}-${building.position?.z}`}
        >
          <TransparentPolygonBuilding
            building={building}
            onClick={onBuildingClick}
          />
        </group>
      ))}

      {/* Render alignment model (reads from Redux state internally) */}
      <AlignmentModel enabled={true} />
    </>
  );
};
