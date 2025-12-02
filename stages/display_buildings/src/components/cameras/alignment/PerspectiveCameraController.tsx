import { useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, PerspectiveCamera } from "three";
import { useDispatch, useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/alignmentSlice";
import { calculateModelBoundingBox } from "../../../utils/modelTransform";
import { keyToDirection } from "../../shared/ui/keyToDirection";

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

  const { getSelectedModel, getPerspectiveCameraState } =
    alignmentSlice.selectors;
  const { updateCameraState } = alignmentSlice.actions;
  const currentModel = useSelector(getSelectedModel);
  const cameraState = useSelector(getPerspectiveCameraState);

  useEffect(() => {
    if (!enabled) return;

    // Configure camera properties for perspective view (only on initialization)
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
