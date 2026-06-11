import { useEffect, useCallback, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3, PerspectiveCamera } from "three";
import { useDispatch, useSelector } from "react-redux";
import { alignmentSlice } from "@slices/alignmentSlice";
import { calculateModelBoundingBox, ModelData } from "@utils/modelTransform";
import { modelsCache } from "@utils/modelsCache";
import { CameraUpdateProps, EnabledProps } from "@.types/component-types";
import { getDirectionFromKey } from "@components/shared/ui/keyToDirection";

interface Props extends EnabledProps, CameraUpdateProps {}

export const PerspectiveCameraController = ({
  enabled,
  onCameraUpdate,
}: Props) => {
  const { camera } = useThree();
  const dispatch = useDispatch();

  const { getModelUUID, getPerspectiveCameraState, getModelTransform } =
    alignmentSlice.selectors;
  const {
    increaseCameraDistance,
    decreaseCameraDistance,
    rotateCameraAroundTarget,
    toggleCameraHeight,
    setCameraView,
  } = alignmentSlice.actions;
  const modelUUID = useSelector(getModelUUID);
  const [currentModel, setCurrentModel] = useState<ModelData | null>(null);
  const cameraState = useSelector(getPerspectiveCameraState);
  const modelTransform = useSelector(getModelTransform);

  useEffect(() => {
    const fetchCurrentModel = async () => {
      if (modelUUID) {
        const modelData: ModelData | null =
          await modelsCache.getModel(modelUUID);
        if (modelData) {
          setCurrentModel(modelData);
        }
      }
    };

    fetchCurrentModel();
  }, [modelUUID]);

  // Update camera when state changes
  useEffect(() => {
    if (!enabled) return;

    // Configure camera properties for perspective view
    camera.position.set(...cameraState.position);
    camera.lookAt(...cameraState.target);
    camera.up.set(0, 1, 0); // Y-up coordinate system (Three.js default and consistent with TopCameraController)

    // Update field of view for perspective camera
    if (camera instanceof PerspectiveCamera && camera.fov !== cameraState.fov) {
      camera.fov = cameraState.fov;
    }

    // Update camera projection matrix
    camera.updateProjectionMatrix();

    // Notify parent component about camera update
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  }, [enabled, camera, cameraState, onCameraUpdate]);

  // Keyboard event handler for camera control
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Handle Ctrl+Space to switch to top view
      if (event.ctrlKey && event.code === "Space") {
        event.preventDefault();

        dispatch(setCameraView("top"));
        return;
      }

      const direction = getDirectionFromKey(event);

      if (direction) {
        event.preventDefault();

        if (direction === "north") {
          // W key: Move forward (decrease distance to model)

          dispatch(decreaseCameraDistance());
        } else if (direction === "south") {
          // S key: Move backward (increase distance from model)

          dispatch(increaseCameraDistance());
        } else if (direction === "east") {
          // D key: Rotate camera clockwise around model

          dispatch(
            rotateCameraAroundTarget({
              view: "perspective",
              horizontalAngle: -5, // Negative for clockwise rotation
              verticalAngle: 0,
            }),
          );
        } else if (direction === "west") {
          // A key: Rotate camera counterclockwise around model

          dispatch(
            rotateCameraAroundTarget({
              view: "perspective",
              horizontalAngle: 5, // Positive for counterclockwise rotation
              verticalAngle: 0,
            }),
          );
        }
      }

      // Handle Space key for toggling camera height
      if (event.code === "Space") {
        event.preventDefault();

        dispatch(toggleCameraHeight());
      }
    },
    [
      enabled,
      dispatch,
      setCameraView,
      increaseCameraDistance,
      decreaseCameraDistance,
      rotateCameraAroundTarget,
      toggleCameraHeight,
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

  return null;
};
