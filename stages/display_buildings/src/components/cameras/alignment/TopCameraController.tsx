import { useEffect, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3, PerspectiveCamera, OrthographicCamera, Euler } from "three";
import { useDispatch, useSelector } from "react-redux";
import { alignmentSlice, WorldDirection } from "../../../store/alignmentSlice";

interface Props {
  enabled: boolean;
  onCameraUpdate?: (camera: any) => void;
}

export const TopCameraController = ({ enabled, onCameraUpdate }: Props) => {
  const { camera } = useThree();
  const dispatch = useDispatch();

  const { getTopCameraState } = alignmentSlice.selectors;
  const { moveTopCameraInDirection } = alignmentSlice.actions;
  const cameraState = useSelector(getTopCameraState);

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

    // Debug logging (uncomment if needed)
    // console.log("Camera update:", cameraState.position);

    // Configure camera properties for top view
    camera.position.set(...cameraState.position);

    // Use standard Y-up coordinate system (Three.js default)
    // For top-down view, camera looks down the negative Y axis
    camera.up.set(0, 1, 0);

    // For top-down view, always look downward (negative Y direction)
    // Calculate lookAt point directly below camera position
    const lookAtPoint = new Vector3(
      cameraState.position[0], // Same X as camera
      cameraState.position[1] - 10, // 10 units below camera
      cameraState.position[2], // Same Z as camera
    );

    // Look at point below camera to maintain consistent downward orientation
    camera.lookAt(lookAtPoint);

    // Update camera projection matrix
    camera.updateProjectionMatrix();

    // Debug logging (uncomment if needed)
    // console.log("Camera positioned at:", camera.position);

    // Notify parent component about camera update
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  }, [enabled, camera, cameraState, onCameraUpdate]);

  // Add keyboard event listeners
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  return null;
};
