import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { ControlsInfo } from "../shared/ui/ControlsInfo";
import { Ground } from "../static/Ground";
import { Lighting } from "../static/Lighting";
import { ViewStage } from "../stage/ui/ViewStage";
import { CameraController } from "./CameraController";

interface BuildingNode {
  x: number;
  z: number;
}

interface Building {
  address: string | null;
  nodes: BuildingNode[];
  height: number;
  position?: BuildingNode;
}

interface BuildingsResponse {
  buildings: Building[];
}

interface Props {
  onModeChange?: () => void;
}

const ITC_CENTER = { x: -326.31, z: 668.04 };

export const ViewUI: React.FC<Props> = ({ onModeChange }) => {
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

      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <button
          onClick={onModeChange}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Switch to Alignment Mode
        </button>
      </div>

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
        <ViewStage buildings={buildings} />

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
