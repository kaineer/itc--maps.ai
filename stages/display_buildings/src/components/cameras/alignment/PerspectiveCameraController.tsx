import { useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, PerspectiveCamera } from "three";
import { useDispatch, useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/alignmentSlice";
import { calculateModelBoundingBox } from "../../../utils/modelTransform";
import { getDirectionFromKey } from "../../shared/ui/keyToDirection";

interface Props {
  enabled: boolean;
  onCameraUpdate?: (camera: any) => void;
}

export const PerspectiveCameraController = ({
  enabled,
  onCameraUpdate,
}: Props) => {
  const { camera } = useThree();
  const dispatch = useDispatch();

  const { getSelectedModel, getPerspectiveCameraState, getPositionStep } =
    alignmentSlice.selectors;
  const {
    updateCameraState,
    increaseCameraDistance,
    decreaseCameraDistance,
    rotateCameraAroundTarget,
  } = alignmentSlice.actions;
  const currentModel = useSelector(getSelectedModel);
  const cameraState = useSelector(getPerspectiveCameraState);
  const positionStep = useSelector(getPositionStep);

  useEffect(() => {
    if (!enabled) return;

    // Configure camera properties for perspective view (only on initialization)
    camera.position.set(...cameraState.position);
    camera.lookAt(...cameraState.target);
    camera.up.set(0, 1, 0); // Y-up coordinate system (Three.js default and consistent with TopCameraController)

    // Update camera projection matrix
    camera.updateProjectionMatrix();

    // Notify parent component about camera update
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  }, [enabled, camera, onCameraUpdate]);

  // Keyboard event handler for camera distance control
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const direction = getDirectionFromKey(event);

      if (direction) {
        event.preventDefault();

        if (direction === "north") {
          // W key: Move forward (decrease distance to model)
          console.log("⬆️ W: Moving camera forward (decreasing distance)", {
            currentPosition: cameraState.position,
            currentTarget: cameraState.target,
            currentDistance: cameraState.cameraDistance,
            positionStep,
          });
          dispatch(decreaseCameraDistance());
        } else if (direction === "south") {
          // S key: Move backward (increase distance from model)
          console.log("⬇️ S: Moving camera backward (increasing distance)", {
            currentPosition: cameraState.position,
            currentTarget: cameraState.target,
            currentDistance: cameraState.cameraDistance,
            positionStep,
          });
          dispatch(increaseCameraDistance());
        } else if (direction === "east") {
          // D key: Rotate camera clockwise around model
          console.log("🔄 D: Rotating camera clockwise", {
            currentPosition: cameraState.position,
            currentTarget: cameraState.target,
            currentDistance: cameraState.cameraDistance,
          });
          dispatch(
            rotateCameraAroundTarget({
              view: "perspective",
              horizontalAngle: -5, // Negative for clockwise rotation
              verticalAngle: 0,
            }),
          );
        } else if (direction === "west") {
          // A key: Rotate camera counterclockwise around model
          console.log("🔄 A: Rotating camera counterclockwise", {
            currentPosition: cameraState.position,
            currentTarget: cameraState.target,
            currentDistance: cameraState.cameraDistance,
          });
          dispatch(
            rotateCameraAroundTarget({
              view: "perspective",
              horizontalAngle: 5, // Positive for counterclockwise rotation
              verticalAngle: 0,
            }),
          );
        }
      }

      // Handle Q/E keys for vertical movement in Z-up coordinate system
      if (event.code === "KeyQ") {
        event.preventDefault();
        console.log("⬆️ Q: Moving camera up (Y+ direction)");
          currentPosition: cameraState.position,
          positionStep,
          newZ: cameraState.position[2] + positionStep,
        });
        // Move camera up (positive Y direction in Y-up coordinate system)
        const newPosition: [number, number, number] = [
          cameraState.position[0],
          cameraState.position[1] + positionStep,
          cameraState.position[2],
        ];
        dispatch(
          updateCameraState({
            view: "perspective",
            cameraState: { position: newPosition },
          }),
        );
      } else if (event.code === "KeyE") {
        event.preventDefault();
        console.log("⬇️ E: Moving camera down (Y- direction)");
        // Move camera down (negative Y direction in Y-up coordinate system)
        const newPosition: [number, number, number] = [
          cameraState.position[0],
          cameraState.position[1] - positionStep,
          cameraState.position[2],
        ];
        dispatch(
          updateCameraState({
            view: "perspective",
            cameraState: { position: newPosition },
          }),
        );
      }
    },
    [
      enabled,
      dispatch,
      increaseCameraDistance,
      decreaseCameraDistance,
      rotateCameraAroundTarget,
      positionStep,
    ],
  );

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

    // Calculate center of the model
    const center = new Vector3();
    boundingBox.getCenter(center);

    // Update camera position from Redux state
    camera.position.set(...cameraState.position);

    // Position camera based on current position (keep for manual movement)
    // Only update target to look at model center
    camera.lookAt(center.x, center.y, center.z);

    // Update field of view for perspective camera (only if needed)
    if (camera instanceof PerspectiveCamera && camera.fov !== cameraState.fov) {
      camera.fov = cameraState.fov;
      camera.updateProjectionMatrix();
    }

    // Update camera state in Redux (only target and fov, position is managed by user)
    dispatch(
      updateCameraState({
        view: "perspective",
        cameraState: {
          target: [center.x, center.y, center.z],
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
