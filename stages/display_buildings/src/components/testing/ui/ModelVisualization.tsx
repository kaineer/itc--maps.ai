/**
 * Temporary component for testing model alignment.
 * This component visualizes the model and syncs its position, rotation, and scale
 * with the Redux state. It should be removed or replaced when actual model
 * rendering is implemented in production.
 */
import { useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/alignmentSlice";
import { Mesh, MeshStandardMaterial } from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

interface Props {
  enabled?: boolean;
}

export const ModelVisualization = ({ enabled = true }: Props) => {
  const { getModelTransform, getSelectedModel } = alignmentSlice.selectors;
  const modelTransform = useSelector(getModelTransform);
  const currentModel = useSelector(getSelectedModel);

  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Sync Three.js mesh with Redux modelTransform
  useFrame(() => {
    if (!enabled || !meshRef.current || !currentModel) return;

    const { position, rotation, scale } = modelTransform;

    // Debug logging is now handled by AlignmentSliceLogger

    // Calculate bottom face center offset for the cube
    // Cube has size 10x10x10, so bottom face center is at y = -5 in local coordinates
    // When scale is applied, the cube size becomes 10*scale, so bottom face is at y = -5*scale
    const cubeSize = 10;
    const bottomFaceYOffset = -cubeSize / 2; // -5 for 10x10x10 cube

    // Apply position with bottom face center adjustment
    // The position from modelTransform is for the model center (or bottom face center for real models),
    // For this test cube, we want the bottom face center at modelTransform.position
    // Formula: adjustedY = positionY - (bottomFaceYOffset * scale)
    // Since bottomFaceYOffset = -5, this becomes: positionY - (-5 * scale) = positionY + 5 * scale
    const adjustedPosition = [
      position[0],
      position[1] - bottomFaceYOffset * scale, // Adjust for scaled cube: adds 5 * scale to Y
      position[2],
    ];

    // Update mesh position (bottom face center at modelTransform.position)
    meshRef.current.position.set(
      adjustedPosition[0],
      adjustedPosition[1],
      adjustedPosition[2],
    );

    // Update mesh rotation (around Y axis)
    meshRef.current.rotation.y = rotation * (Math.PI / 180); // Convert degrees to radians

    // Update mesh scale (uniform scaling)
    meshRef.current.scale.set(scale, scale, scale);
  });

  if (!enabled || !currentModel) {
    return null;
  }

  // For now, render a simple placeholder cube
  // In the future, this should render the actual model from currentModel
  // Note: The cube is positioned so its bottom face center is at modelTransform.position
  // This matches how real models should be positioned (bottom face on ground at position)
  return (
    <mesh
      ref={meshRef}
      userData={{ isModel: true }}
      name="alignment-model"
      onPointerOver={(event) => {
        event.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setIsHovered(false);
      }}
    >
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial
        ref={materialRef}
        color={isHovered ? "#006600" : "#00FF00"}
      />
    </mesh>
  );
};
