import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { ControlsInfo } from "./components/shared/ui/ControlsInfo";
import { Ground } from "./components/static/Ground";
import { Lighting } from "./components/static/Lighting";
import { BuildingMesh } from "./components/building/ui/BuildingMesh";

interface BuildingNode {
  x: number;
  z: number;
}

interface Building {
  address: string | null;
  nodes: BuildingNode[];
  height: number;
}

interface BuildingsResponse {
  buildings: Building[];
}

const ITC_CENTER = { x: -326.31, z: 668.04 };

const App: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/buildings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: ITC_CENTER,
            distance: 500, // Load buildings within 500 units
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BuildingsResponse = await response.json();
        setBuildings(data.buildings || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load buildings",
        );
        console.error("Error fetching buildings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, []);

  if (loading) {
    return <div className="loading">Loading 3D buildings visualization...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error loading buildings</h3>
        <p>{error}</p>
        <p style={{ marginTop: "10px", fontSize: "14px" }}>
          Make sure the backend server is running on localhost:5000
        </p>
      </div>
    );
  }

  return (
    <>
      <ControlsInfo />

      <Canvas
        camera={{
          position: [ITC_CENTER.x, 1.8, ITC_CENTER.z + 10],
          fov: 60,
        }}
        shadows
      >
        <color attach="background" args={["#87CEEB"]} />

        {/* Lighting */}
        <Lighting />

        {/* Ground */}
        <Ground />

        {/* Buildings */}
        {buildings.map((building, index) => (
          <BuildingMesh key={index} building={building} />
        ))}

        {/* ITC Center Marker */}
        <mesh position={[ITC_CENTER.x, 5, ITC_CENTER.z]}>
          <sphereGeometry args={[3, 16, 16]} />
          <meshStandardMaterial color="#FF0000" />
        </mesh>
        <Text
          position={[ITC_CENTER.x, 15, ITC_CENTER.z]}
          fontSize={8}
          color="#FF0000"
          anchorX="center"
          anchorY="middle"
        >
          ITC Center
        </Text>

        {/* Controls */}
        {/*
          OrbitControls handles mouse rotation while CameraController handles WASD movement.
          Both work together by moving both camera position and controls target simultaneously.
        */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[ITC_CENTER.x, 1.8, ITC_CENTER.z]}
        />

        {/* Camera Controller for WASD movement */}
        <CameraController />
      </Canvas>
    </>
  );
};

// Camera controller for WASD movement with fixed height
const CameraController: React.FC = () => {
  const moveState = useRef({
    forward: false,
    backward: false,
  });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
          moveState.current.forward = true;
          break;
        case "s":
          moveState.current.backward = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
          moveState.current.forward = false;
          break;
        case "s":
          moveState.current.backward = false;
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

  useFrame((state, delta) => {
    const { camera, controls } = state;
    const moveSpeed = 5.0 * delta;

    if (moveState.current.forward || moveState.current.backward) {
      // Get camera direction
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);

      // Remove vertical component to keep movement horizontal
      cameraDirection.y = 0;
      cameraDirection.normalize();

      // Calculate movement vector
      const moveVector = new THREE.Vector3();

      if (moveState.current.forward) {
        moveVector.add(cameraDirection);
      }
      if (moveState.current.backward) {
        moveVector.sub(cameraDirection);
      }

      // Normalize diagonal movement
      if (moveVector.length() > 0) {
        moveVector.normalize();
        moveVector.multiplyScalar(moveSpeed);

        // Move both camera and controls target simultaneously
        // This maintains OrbitControls rotation while allowing WASD movement
        if (controls && "target" in controls) {
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

export default App;
