import { useEffect, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useDispatch, useSelector } from "react-redux";
import { alignmentSlice, WorldDirection } from "../../../store/alignmentSlice";

interface Props {
  enabled: boolean;
  onCameraUpdate?: (camera: any) => void;
}

export const TopCameraController = ({ enabled, onCameraUpdate }: Props) => {
  const { camera } = useThree();
  const dispatch = useDispatch();

  const { getTopCameraState, getModelTransform } = alignmentSlice.selectors;
  const { moveTopCameraInDirection, moveModelInDirection } =
    alignmentSlice.actions;
  const cameraState = useSelector(getTopCameraState);
  const modelTransform = useSelector(getModelTransform);

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

        // Check if Shift key is pressed
        if (event.shiftKey) {
          // Shift + WASD: Move model
          console.log(
            `Shift+${event.key.toUpperCase()}: Moving model ${direction}`,
          );
          dispatch(moveModelInDirection(direction));
        } else {
          // WASD only: Move camera
          console.log(`${event.key.toUpperCase()}: Moving camera ${direction}`);
          dispatch(moveTopCameraInDirection(direction));
        }
      }
    },
    [enabled, dispatch, moveTopCameraInDirection, moveModelInDirection],
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
    // Calculate lookAt point based on camera height
    const cameraHeight = cameraState.position[1];
    const lookDownDistance = Math.max(cameraHeight * 0.2, 10); // Look 20% down or at least 10 units

    const lookAtPoint = new Vector3(
      cameraState.position[0], // Same X as camera
      cameraState.position[1] - lookDownDistance, // Look downward based on height
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

  // Log model position changes
  useEffect(() => {
    if (!enabled) return;
    console.log("Model position updated:", modelTransform.position);
  }, [enabled, modelTransform.position]);

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
