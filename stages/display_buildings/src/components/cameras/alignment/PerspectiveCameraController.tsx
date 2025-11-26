import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { alignmentSlice } from "../alignmentSlice";

interface Props {
  enabled: boolean;
  onCameraUpdate?: (camera: PerspectiveCamera) => void;
}

export const PerspectiveCameraController = ({
  enabled,
  onCameraUpdate,
}: Props) => {
  const cameraRef = useRef<PerspectiveCamera>(null);
  const { scene, setDefaultCamera } = useThree();
  const dispatch = useAppDispatch();
  const alignmentState = useAppSelector((state) => state.alignment);

  // Camera configuration
  const cameraDistance = 50;
  const fov = 60;
  const nearPlane = 0.1;
  const farPlane = 1000;
  const orbitRadius = 30;
  const orbitSpeed = 0.002;

  useEffect(() => {
    if (!cameraRef.current || !enabled) return;

    const camera = cameraRef.current;

    // Set as default camera when enabled
    if (enabled) {
      setDefaultCamera(camera);
    }

    // Configure camera properties
    camera.fov = fov;
    camera.near = nearPlane;
    camera.far = farPlane;
    camera.position.set(cameraDistance, cameraDistance, cameraDistance);
    camera.lookAt(0, 0, 0);
    camera.up.set(0, 0, 1); // Z-up coordinate system

    // Update camera projection matrix
    camera.updateProjectionMatrix();

    // Notify parent component about camera update
    if (onCameraUpdate) {
      onCameraUpdate(camera);
    }
  }, [enabled, setDefaultCamera, onCameraUpdate]);

  useFrame((state, delta) => {
    if (!cameraRef.current || !enabled || !alignmentState.currentModel) return;

    const camera = cameraRef.current;
    const model = alignmentState.currentModel;

    // Calculate bounding box for the model
    const boundingBox = model.geometry.boundingBox;
    if (!boundingBox) {
      model.geometry.computeBoundingBox();
      return;
    }

    // Calculate center of the model
    const center = new Vector3();
    boundingBox.getCenter(center);

    // Calculate model dimensions for camera distance
    const size = new Vector3();
    boundingBox.getSize(size);
    const maxDimension = Math.max(size.x, size.y, size.z);
    const optimalDistance = maxDimension * 2;

    // Smooth orbit around the model
    const time = state.clock.getElapsedTime();
    const orbitX = center.x + Math.cos(time * orbitSpeed) * orbitRadius;
    const orbitZ = center.z + Math.sin(time * orbitSpeed) * orbitRadius;

    // Position camera with smooth orbit
    camera.position.set(orbitX, optimalDistance * 0.7, orbitZ);
    camera.lookAt(center.x, center.y, center.z);

    // Adjust field of view based on model size for better viewing
    const dynamicFov = Math.min(fov, 45 + maxDimension * 0.5);
    if (Math.abs(camera.fov - dynamicFov) > 0.1) {
      camera.fov = dynamicFov;
      camera.updateProjectionMatrix();
    }

    // Update camera state in Redux
    dispatch(
      alignmentSlice.actions.updateCameraState({
        view: "perspective",
        cameraState: {
          position: [camera.position.x, camera.position.y, camera.position.z],
          target: [center.x, center.y, center.z],
          fov: camera.fov,
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
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault={enabled}
      position={[cameraDistance, cameraDistance, cameraDistance]}
      fov={fov}
      near={nearPlane}
      far={farPlane}
    />
  );
};
