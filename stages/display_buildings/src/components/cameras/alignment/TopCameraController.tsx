import { useEffect, useCallback } from "react";
import { useThree } from "@react-three/fiber";
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

    // Configure camera properties for top view
    camera.position.set(...cameraState.position);
    camera.lookAt(...cameraState.target);
    camera.up.set(0, 0, 1); // Z-up coordinate system

    // Update camera projection matrix
    camera.updateProjectionMatrix();

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
