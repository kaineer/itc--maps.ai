import { useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, OrthographicCamera } from "three";
import { useDispatch, useSelector } from "react-redux";
import { alignmentSlice, WorldDirection } from "../../../store/alignmentSlice";
import { calculateModelBoundingBox } from "../../../utils/modelTransform";

interface Props {
  enabled: boolean;
  onCameraUpdate?: (camera: any) => void;
}

export const TopCameraController = ({ enabled, onCameraUpdate }: Props) => {
  const { camera } = useThree();
  const dispatch = useDispatch();

  const { getSelectedModel, getTopCameraState } = alignmentSlice.selectors;
  const { updateCameraState, moveTopCameraInDirection } =
    alignmentSlice.actions;
  const currentModel = useSelector(getSelectedModel);
  const cameraState = useSelector(getTopCameraState);

  // Camera configuration
  const zoomFactor = 1.2;

  // Key to direction mapping
  const keyToDirection: { [key: string]: WorldDirection } = {
    w: "north",
    a: "west",
    s: "south",
    d: "east",
  };

  // Keyboard event handler
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const direction = keyToDirection[event.key.toLowerCase()];

      if (direction) {
        event.preventDefault();
        dispatch(moveTopCameraInDirection(direction));
      }
    },
    [enabled, dispatch, moveTopCameraInDirection],
  );

  useEffect(() => {
    if (!enabled) return;

    // Configure camera properties for top view (only on initialization)
    camera.position.set(...cameraState.position);
    camera.lookAt(...cameraState.target);
    camera.up.set(0, 0, 1); // Z-up coordinate system

    // Update camera projection matrix
    camera.updateProjectionMatrix();

    // Notify parent component about camera update
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  }, [enabled, camera, onCameraUpdate]);

  // Add keyboard event listeners
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  useFrame(() => {
    if (!enabled || !currentModel) return;

    // Calculate bounding box for the model
    const boundingBox =
      currentModel.metadata.boundingBox ||
      calculateModelBoundingBox(currentModel);
    if (!boundingBox) {
      return;
    }

    // Calculate model dimensions
    const size = new Vector3();
    boundingBox.getSize(size);

    // Calculate center of the model
    const center = new Vector3();
    boundingBox.getCenter(center);

    // Position camera above the model (keep current position for manual movement)
    // Only update target to look at model center
    camera.lookAt(center.x, 0, center.z);

    // For orthographic camera, adjust bounds based on model size
    if (camera instanceof OrthographicCamera) {
      const maxDimension = Math.max(size.x, size.z);
      const viewSize = maxDimension * zoomFactor;

      camera.left = -viewSize / 2;
      camera.right = viewSize / 2;
      camera.top = viewSize / 2;
      camera.bottom = -viewSize / 2;
    }

    // Update projection matrix
    camera.updateProjectionMatrix();

    // Update camera state in Redux (only target, position is managed by user)
    dispatch(
      updateCameraState({
        view: "top",
        cameraState: {
          position: [camera.position.x, camera.position.y, camera.position.z],
          target: [center.x, 0, center.z],
          fov: 60,
        },
      }),
    );

    // Notify parent component about camera update
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  });

  return null;
};
