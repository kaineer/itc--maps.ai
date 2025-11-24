import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraController: React.FC = () => {
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          moveState.current.forward = true;
          break;
        case 's':
          moveState.current.backward = true;
          break;
        case 'a':
          moveState.current.left = true;
          break;
        case 'd':
          moveState.current.right = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case 'w':
          moveState.current.forward = false;
          break;
        case 's':
          moveState.current.backward = false;
          break;
        case 'a':
          moveState.current.left = false;
          break;
        case 'd':
          moveState.current.right = false;
          break;
      }
    };

    const eventTarget = document;

    eventTarget.addEventListener('keydown', handleKeyDown);
    eventTarget.addEventListener('keyup', handleKeyUp);

    return () => {
      eventTarget.removeEventListener('keydown', handleKeyDown);
      eventTarget.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const { camera, controls } = state;
    const moveSpeed = 5.0 * delta;

    if (moveState.current.forward || moveState.current.backward ||
        moveState.current.left || moveState.current.right) {

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
        if (controls && 'target' in controls) {
          const controlsTarget = (controls as any).target;
          controlsTarget.x += moveVector.x;
          controlsTarget.z += moveVector.z;
          camera.position.x += moveVector.x;
          camera.position.z += moveVector.z;
        }
      }
    }

    // Ensure fixed height of 1.8
    camera.position.y = 1.8;
  });

  return null;
};
