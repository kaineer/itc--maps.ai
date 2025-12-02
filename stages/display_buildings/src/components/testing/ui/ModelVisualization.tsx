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

    // Update mesh position
    meshRef.current.position.set(...position);

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
