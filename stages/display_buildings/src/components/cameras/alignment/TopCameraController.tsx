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

  const { getTopCameraState } = alignmentSlice.selectors;
  const {
    moveTopCameraInDirection,
    moveModelInDirection,
    increasePositionStep,
    decreasePositionStep,
  } = alignmentSlice.actions;
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

        // Check if Shift key is pressed
        if (event.shiftKey) {
          // Shift + WASD: Move model
          dispatch(moveModelInDirection(direction));
        } else {
          // WASD only: Move camera
          dispatch(moveTopCameraInDirection(direction));
        }
        return;
      }

      // Handle position step adjustment with Shift + Arrow keys
      if (event.shiftKey) {
        if (event.key === "ArrowUp" || event.key === "Up") {
          event.preventDefault();
          dispatch(increasePositionStep());
        } else if (event.key === "ArrowDown" || event.key === "Down") {
          event.preventDefault();
          dispatch(decreasePositionStep());
        }
      }
    },
    [
      enabled,
      dispatch,
      moveTopCameraInDirection,
      moveModelInDirection,
      increasePositionStep,
      decreasePositionStep,
    ],
  );

  // Position step changes are now logged by AlignmentSliceLogger

  useEffect(() => {
    if (!enabled) return;

    // Camera updates are now logged by AlignmentSliceLogger

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

    // Camera positioning is now logged by AlignmentSliceLogger

    // Notify parent component about camera update
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  }, [enabled, camera, cameraState, onCameraUpdate]);

  // Model position changes are now logged by AlignmentSliceLogger

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
