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
        console.log(`Key pressed: ${event.key} -> Direction: ${direction}`);
        dispatch(moveTopCameraInDirection(direction));
      }
    },
    [enabled, dispatch, moveTopCameraInDirection],
  );

  useEffect(() => {
    if (!enabled) return;

    console.log("=== CAMERA UPDATE ===");
    console.log("Camera state from Redux:", cameraState);
    console.log("Camera type:", camera.type);
    console.log("Is PerspectiveCamera?", camera instanceof PerspectiveCamera);
    console.log("Is OrthographicCamera?", camera instanceof OrthographicCamera);

    // Configure camera properties for top view
    camera.position.set(...cameraState.position);

    // For top-down view, camera should look down the negative Y axis
    // Set up vector to positive Z to maintain consistent orientation
    camera.up.set(0, 0, 1);

    // Look at target with explicit up vector to prevent flipping
    camera.lookAt(
      new Vector3(...cameraState.target).x,
      new Vector3(...cameraState.target).y,
      new Vector3(...cameraState.target).z,
    );

    // Update camera projection matrix
    camera.updateProjectionMatrix();

    // Log camera orientation for debugging
    console.log("Camera position after set:", camera.position);
    console.log("Camera rotation:", camera.rotation.toArray());
    console.log("Camera up vector:", camera.up);
    console.log("Camera projection matrix updated");

    // Log final camera transform
    const euler = new Euler().setFromRotationMatrix(camera.matrix);
    console.log(
      "Camera Euler angles (degrees):",
      euler.x * (180 / Math.PI),
      euler.y * (180 / Math.PI),
      euler.z * (180 / Math.PI),
    );

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
