import { useSelector } from "react-redux";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, MeshBasicMaterial, Box3 } from "three";
import { EnabledProps } from "../shared/types";
import { alignmentSlice } from "@slices/alignmentSlice";
import { modelsCache } from "@utils/modelsCache";
import { ModelData } from "@utils/modelTransform";

interface Props extends EnabledProps {}

/**
 * AlignmentModel component for rendering the selected model for alignment.
 *
 * This component:
 * 1. Gets the current model and its transform from Redux state
 * 2. Applies position, rotation, and scale from modelTransform
 * 3. Renders the model with wireframe material for alignment visualization
 * 4. Positions the model with bottom face center at modelTransform.position
 */
export const AlignmentModel = ({ enabled = true }: Props) => {
  const { getModelUUID, getModelTransform } = alignmentSlice.selectors;
  const modelUUID = useSelector(getModelUUID);
  const modelTransform = useSelector(getModelTransform);
  const [currentModel, setCurrentModel] = useState<ModelData | null>(null);

  const modelRef = useRef<any>(null);
  const originalMaterialsRef = useRef<Map<Mesh, any>>(new Map());

  useEffect(() => {
    const fetchModelFromCache = async (modelUUID: string) => {
      const model = await modelsCache.getModel(modelUUID);
      if (model) {
        setCurrentModel(model);
      }
    };

    modelUUID && fetchModelFromCache(modelUUID);
  }, [modelUUID]);

  // Apply wireframe material to model
  useEffect(() => {
    if (!enabled || !currentModel || !modelRef.current) return;

    const model = modelRef.current;
    const originalMaterials = originalMaterialsRef.current;

    // Clear previous materials map
    originalMaterials.clear();

    // Apply wireframe material to all meshes
    model.traverse((child: any) => {
      if (child instanceof Mesh) {
        // Store original material
        originalMaterials.set(child, child.material);

        // Create wireframe material
        const wireframeMaterial = new MeshBasicMaterial({
          color: 0x00ff00, // Green wireframe
          wireframe: true,
          transparent: true,
          opacity: 0.8,
        });

        child.material = wireframeMaterial;
      }
    });

    // Cleanup: restore original materials
    return () => {
      model.traverse((child: any) => {
        if (child instanceof Mesh && originalMaterials.has(child)) {
          child.material = originalMaterials.get(child);
        }
      });
      originalMaterials.clear();
    };
  }, [enabled, currentModel]);

  // Apply model transform from Redux state
  useFrame(() => {
    if (!enabled || !currentModel || !modelRef.current) return;

    const { position, rotation, scale } = modelTransform;
    const model = modelRef.current;

    // Calculate bottom face center offset
    // We need to get the bounding box to calculate Y offset for bottom face positioning
    const bbox = new Box3().setFromObject(model);
    const minY = bbox.min.y;

    // The modelTransform.position is for the bottom face center
    // We need to adjust Y position based on model's bounding box and scale
    const bottomFaceYOffset = minY * scale;
    const adjustedPosition = [
      position[0],
      position[1] - bottomFaceYOffset, // Adjust for bottom face center
      position[2],
    ];

    // Apply position
    model.position.set(
      adjustedPosition[0],
      adjustedPosition[1],
      adjustedPosition[2],
    );

    // Apply rotation (around Y axis, convert degrees to radians)
    model.rotation.y = rotation * (Math.PI / 180);

    // Apply uniform scale
    model.scale.set(scale, scale, scale);
  });

  if (!enabled || !currentModel || !currentModel.modelObject) {
    return null;
  }

  return <primitive ref={modelRef} object={currentModel.modelObject} />;
};
