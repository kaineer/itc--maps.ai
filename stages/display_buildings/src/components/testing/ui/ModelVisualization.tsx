/**
 * Temporary component for testing model alignment.
 * This component visualizes the model and syncs its position, rotation, and scale
 * with the Redux state. It should be removed or replaced when actual model
 * rendering is implemented in production.
 */
import { useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/alignmentSlice";
import { Mesh } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface Props {
  enabled?: boolean;
}

export const ModelVisualization = ({ enabled = true }: Props) => {
  const { getModelTransform, getSelectedModel } = alignmentSlice.selectors;
  const modelTransform = useSelector(getModelTransform);
  const currentModel = useSelector(getSelectedModel);

  const meshRef = useRef<Mesh>(null);

  // Sync Three.js mesh with Redux modelTransform
  useFrame(() => {
    if (!enabled || !meshRef.current || !currentModel) return;

    const { position, rotation, scale } = modelTransform;

    // Debug logging (uncomment if needed)
    // console.log("ModelVisualization - Updating mesh:", { position, rotation, scale });

    // Update mesh position
    meshRef.current.position.set(...position);

    // Update mesh rotation (around Y axis)
    meshRef.current.rotation.y = rotation * (Math.PI / 180); // Convert degrees to radians

    // Update mesh scale (uniform scaling)
    meshRef.current.scale.set(scale, scale, scale);
  });

  if (!enabled || !currentModel) {
    console.log(
      "ModelVisualization - Not rendering: enabled=",
      enabled,
      "currentModel=",
      !!currentModel,
    );
    return null;
  }

  // Debug logging
  console.log(
    "ModelVisualization - Rendering model at position:",
    modelTransform.position,
  );

  // For now, render a simple placeholder cube
  // In the future, this should render the actual model from currentModel
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial color="#00FF00" />
    </mesh>
  );
};
