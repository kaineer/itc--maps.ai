import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import { viewSlice } from "@slices/viewSlice";
import { MOVEMENT_SPEEDS, CAMERA_HEIGHTS, DISTANCES } from "@utils/constants";
import { AppDispatch } from "@store/index";
import { buildingsSlice } from "@slices/buildingsSlice";
import { distance2dBetween } from "@components/shared/positionMath";
import { useViewCamera } from "@hooks/useViewSlice";

export const ViewTopCameraController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getLastLoadedPosition, getLoading } = buildingsSlice.selectors;

  const { cameraPosition, cameraTarget } = useViewCamera();

  const lastLoadedPosition = useSelector(getLastLoadedPosition);
  const { updateCameraPosition, updateCameraTarget } = viewSlice.actions;
  const buildingsLoading = useSelector(getLoading);

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

  // Handle keyboard input for WASD movement
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

  // Update URL hash with camera position
  useEffect(() => {
    const [x, _, z] = lastLoadedPosition;
    if (x && z) {
      const query = "x=" + x.toFixed(2) + "&z=" + z.toFixed(2);
      window.location.hash = "#" + query;
    }
  }, [lastLoadedPosition]);

  useFrame((state, delta) => {
    const { camera, controls } = state;
    const moveSpeed = MOVEMENT_SPEEDS.MAP * delta;

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
      // For top-down view, camera is positioned at fixed height
      camera.position.set(
        currentPosition[0],
        CAMERA_HEIGHTS.TOP_DOWN, // Fixed top-down height
        currentPosition[2],
      );

      // Use standard Y-up coordinate system (Three.js default)
      // For top-down view, camera looks down the negative Y axis
      camera.up.set(0, 1, 0);

      // For top-down view, look straight down at ground level (y=0)
      // The camera is at height TOP_DOWN, looking at the point directly below it
      const lookAtPoint = new THREE.Vector3(
        currentPosition[0], // Same X as camera
        0, // Look at ground level
        currentPosition[2], // Same Z as camera
      );

      // Look at ground point directly below camera
      camera.lookAt(lookAtPoint);

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

    // Handle WASD keyboard movement for top-down camera
    if (
      moveState.current.forward ||
      moveState.current.backward ||
      moveState.current.left ||
      moveState.current.right
    ) {
      // For top-down camera, movement is simpler - just move in XZ plane
      const moveVector = new THREE.Vector3();

      // Forward/backward moves along camera's forward direction (north/south in top view)
      if (moveState.current.forward) {
        moveVector.z -= moveSpeed; // Move north (negative Z in Three.js)
      }
      if (moveState.current.backward) {
        moveVector.z += moveSpeed; // Move south (positive Z in Three.js)
      }

      // Left/right moves along camera's right direction (west/east in top view)
      if (moveState.current.left) {
        moveVector.x -= moveSpeed; // Move west (negative X)
      }
      if (moveState.current.right) {
        moveVector.x += moveSpeed; // Move east (positive X)
      }

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

        // Keep camera at fixed top-down height
        camera.position.y = CAMERA_HEIGHTS.TOP_DOWN;

        // Update Redux state to keep in sync
        dispatch(updateCameraTarget([newTargetX, 0, newTargetZ]));
        dispatch(
          updateCameraPosition([
            newCameraX,
            CAMERA_HEIGHTS.TOP_DOWN, // Fixed top-down height
            newCameraZ,
          ]),
        );
      }
    }

    // Ensure fixed height at top-down level
    camera.position.y = CAMERA_HEIGHTS.TOP_DOWN;

    // Ensure camera maintains top-down orientation looking straight down
    // Always look at ground level (y=0) directly below camera's XZ position
    camera.lookAt(
      camera.position.x,
      0, // Ground level
      camera.position.z,
    );
  });

  return null;
};
