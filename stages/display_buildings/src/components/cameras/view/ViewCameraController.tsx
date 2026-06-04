import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import { viewSlice } from "@slices/viewSlice";
import { MOVEMENT_SPEEDS, CAMERA_HEIGHTS } from "@utils/constants";
import { AppDispatch } from "@store/index";
import {
  directionTo,
  distance2dBetween,
  dotProduct2d,
} from "@components/shared/positionMath";
import { useViewCamera } from "@hooks/view/useViewSlice";
import { useBuildingsSlice } from "@entities/buildings/lib/use.buildings.slice";
import { useMinimapMarkers } from "@entities/minimap/lib/use.minimap.slice";

export const ViewCameraController = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { cameraPosition, cameraTarget } = useViewCamera();

  const { markers } = useMinimapMarkers();

  const { lastLoadedPosition } = useBuildingsSlice();

  const { updateCameraPosition, updateCameraTarget, setActiveMarker } =
    viewSlice.actions;

  // Use refs to store current Redux state for useFrame callback
  const currentReduxState = useRef({
    position: cameraPosition,
    target: cameraTarget,
  });

  // Update refs when Redux state changes
  useEffect(() => {
    currentReduxState.current.position = cameraPosition;
    currentReduxState.current.target = cameraTarget;
  }, [cameraPosition, cameraTarget]);

  useEffect(() => {
    const closestMarker = (markers || []).find((marker) => {
      const dist = distance2dBetween(cameraPosition, marker.position);
      return dist < 5;
    });

    if (closestMarker) {
      const { position, target } = closestMarker;
      const direction = directionTo(position, target);
      const cameraDirection = directionTo(cameraPosition, cameraTarget);

      const dot2d = dotProduct2d(direction, cameraDirection);

      if (Math.abs(dot2d) > 0.85) {
        dispatch(setActiveMarker(closestMarker));
        return void 0;
      }
    }

    dispatch(setActiveMarker(null));
  }, [cameraPosition, markers, dispatch]);

  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    faster: false,
  });

  // Track previous Redux state to detect changes
  const prevReduxState = useRef({
    position: cameraPosition,
    target: cameraTarget,
  });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          moveState.current.forward = true;
          break;
        case "KeyS":
          moveState.current.backward = true;
          break;
        case "KeyA":
          moveState.current.left = true;
          break;
        case "KeyD":
          moveState.current.right = true;
          break;
        case "AltLeft":
          moveState.current.faster = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          moveState.current.forward = false;
          break;
        case "KeyS":
          moveState.current.backward = false;
          break;
        case "KeyA":
          moveState.current.left = false;
          break;
        case "KeyD":
          moveState.current.right = false;
          break;
        case "AltLeft":
          moveState.current.faster = false;
          break;
      }
    };

    const eventTarget = document;

    eventTarget.addEventListener("keydown", handleKeyDown);
    eventTarget.addEventListener("keyup", handleKeyUp);

    return () => {
      eventTarget.removeEventListener("keydown", handleKeyDown);
      eventTarget.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const [x, _, z] = lastLoadedPosition;
    if (x && z) {
      const query = "x=" + x.toFixed(2) + "&z=" + z.toFixed(2);
      window.location.hash = "#" + query;
    }
  }, [lastLoadedPosition]);

  useFrame((state, delta) => {
    const { camera, controls } = state;
    const moveSpeed =
      (moveState.current.faster ? MOVEMENT_SPEEDS.FAST : MOVEMENT_SPEEDS.FAST) *
      delta;

    // Get current Redux state from refs (updated by useEffect)
    const currentPosition = currentReduxState.current.position;
    const currentTarget = currentReduxState.current.target;

    // Check if Redux state has changed (camera moved by BuildingSearch or other components)
    const hasReduxPositionChanged =
      prevReduxState.current.position[0] !== currentPosition[0] ||
      prevReduxState.current.position[2] !== currentPosition[2];

    const hasReduxTargetChanged =
      prevReduxState.current.target[0] !== currentTarget[0] ||
      prevReduxState.current.target[2] !== currentTarget[2];

    // If Redux state changed, update Three.js camera and controls
    if (hasReduxPositionChanged || hasReduxTargetChanged) {
      // Update camera position from Redux (ensure Y coordinate is fixed at eye level)
      camera.position.set(
        currentPosition[0],
        CAMERA_HEIGHTS.EYE_LEVEL, // Fixed eye level height
        currentPosition[2],
      );

      // Update OrbitControls target from Redux
      if (controls && "target" in controls) {
        const controlsTarget = (controls as any).target;
        controlsTarget.set(
          currentTarget[0],
          currentTarget[1],
          currentTarget[2],
        );
      }

      // Update previous state
      prevReduxState.current.position = currentPosition;
      prevReduxState.current.target = currentTarget;
    }

    // Handle WASD keyboard movement
    if (
      moveState.current.forward ||
      moveState.current.backward ||
      moveState.current.left ||
      moveState.current.right
    ) {
      // Get camera direction
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);

      // Remove vertical component to keep movement horizontal
      cameraDirection.y = 0;
      cameraDirection.normalize();

      // Calculate right vector for strafing
      const rightVector = new THREE.Vector3();
      rightVector.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
      rightVector.normalize();

      // Calculate movement vector
      const moveVector = new THREE.Vector3();

      if (moveState.current.forward) {
        moveVector.add(cameraDirection);
      }
      if (moveState.current.backward) {
        moveVector.sub(cameraDirection);
      }
      if (moveState.current.left) {
        moveVector.sub(rightVector);
      }
      if (moveState.current.right) {
        moveVector.add(rightVector);
      }

      // Normalize diagonal movement
      if (moveVector.length() > 0) {
        moveVector.normalize();
        moveVector.multiplyScalar(moveSpeed);

        // Move both camera and controls target simultaneously
        // This maintains OrbitControls rotation while allowing WASD movement
        if (controls && "target" in controls) {
          const controlsTarget = (controls as any).target;
          const newTargetX = controlsTarget.x + moveVector.x;
          const newTargetZ = controlsTarget.z + moveVector.z;
          const newCameraX = camera.position.x + moveVector.x;
          const newCameraZ = camera.position.z + moveVector.z;

          // Update Three.js objects
          controlsTarget.x = newTargetX;
          controlsTarget.z = newTargetZ;
          camera.position.x = newCameraX;
          camera.position.z = newCameraZ;

          // Update Redux state to keep in sync
          dispatch(updateCameraTarget([newTargetX, 0, newTargetZ]));
          dispatch(
            updateCameraPosition([
              newCameraX,
              CAMERA_HEIGHTS.EYE_LEVEL, // Fixed eye level height
              newCameraZ,
            ]),
          );
        }
      }
    }

    // Ensure fixed height at eye level (in case Redux state has wrong Y value)
    camera.position.y = CAMERA_HEIGHTS.EYE_LEVEL;
  });

  return null;
};
