import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrthographicCamera, Vector3 } from "three";
import { useDispatch, useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/alignmentSlice";

interface Props {
  enabled: boolean;
  onCameraUpdate?: (camera: OrthographicCamera) => void;
}

export const TopCameraController = ({ enabled, onCameraUpdate }: Props) => {
  const cameraRef = useRef<OrthographicCamera>(null);
  const { scene } = useThree();
  const dispatch = useDispatch();

  const { getSelectedModel, getTopCameraState } = alignmentSlice.selectors;
  const { updateCameraState } = alignmentSlice.actions;
  const currentModel = useSelector(getSelectedModel);
  const cameraState = useSelector(getTopCameraState);

  // Camera configuration
  const nearPlane = 0.1;
  const farPlane = 1000;
  const zoomFactor = 1.2;

  useEffect(() => {
    if (!cameraRef.current || !enabled) return;

    const camera = cameraRef.current;

    // Configure camera properties
    camera.position.set(...cameraState.position);
    camera.lookAt(...cameraState.target);
    camera.up.set(0, 0, 1); // Z-up coordinate system
    camera.near = nearPlane;
    camera.far = farPlane;

    // Update camera projection matrix
    camera.updateProjectionMatrix();

    // Notify parent component about camera update
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  }, [enabled, onCameraUpdate]);

  useFrame(() => {
    if (!cameraRef.current || !enabled || !currentModel) return;

    const camera = cameraRef.current;
    const model = currentModel;

    // Calculate bounding box for the model
    const boundingBox = model.geometry.boundingBox;
    if (!boundingBox) {
      model.geometry.computeBoundingBox();
      return;
    }

    // Calculate model dimensions
    const size = new Vector3();
    boundingBox.getSize(size);

    // Calculate center of the model
    const center = new Vector3();
    boundingBox.getCenter(center);

    // Position camera above the model
    camera.position.set(...cameraState.position);
    camera.lookAt(...cameraState.target);

    // Adjust orthographic camera bounds based on model size
    const maxDimension = Math.max(size.x, size.z);
    const viewSize = maxDimension * zoomFactor;

    camera.left = -viewSize / 2;
    camera.right = viewSize / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;

    // Update projection matrix
    camera.updateProjectionMatrix();

    // Update camera state in Redux
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

  if (!enabled) {
    return null;
  }

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault={enabled}
      position={cameraState.position}
      near={nearPlane}
      far={farPlane}
    />
  );
};
