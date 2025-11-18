import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

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

const BuildingMesh: React.FC<{ building: Building }> = ({ building }) => {
  const meshRef = useRef<THREE.Group>(null);

  if (!building.nodes || building.nodes.length < 2) {
    return null;
  }

  const meshes = [];

  // Create walls between consecutive nodes
  for (let i = 0; i < building.nodes.length; i++) {
    const current = building.nodes[i];
    const next = building.nodes[(i + 1) % building.nodes.length];

    const [currentX, currentZ] = current;
    const [nextX, nextZ] = next;

    if (!current || !next) continue;

    // Calculate wall position and dimensions
    const midX = (currentX + nextX) / 2;
    const midZ = (currentZ + nextZ) / 2;
    const height = building.height || 3;

    // Calculate wall length and rotation
    const dx = nextX - currentX;
    const dz = nextZ - currentZ;
    const length = Math.sqrt(dx * dx + dz * dz);
    const rotation = Math.atan2(dz, dx);

    if (length > 0) {
      meshes.push(
        <mesh
          key={`wall-${i}`}
          position={[midX, height / 2, midZ]}
          rotation={[0, -rotation, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[length, height, 0.1]} />
          <meshStandardMaterial
            color={building.address ? "#8B4513" : "#A9A9A9"}
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>,
      );
    }
  }

  // Create roof (simple flat plane for now)
  if (building.nodes.length >= 3) {
    const roofShape = new THREE.Shape();
    building.nodes.forEach((node, index) => {
      if (index === 0) {
        roofShape.moveTo(node.x, node.z);
      } else {
        roofShape.lineTo(node.x, node.z);
      }
    });
    roofShape.lineTo(building.nodes[0].x, building.nodes[0].z);

    const roofGeometry = new THREE.ShapeGeometry(roofShape);

    meshes.push(
      <mesh
        key="roof"
        position={[0, building.height, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <primitive object={roofGeometry} />
        <meshStandardMaterial color="#654321" roughness={0.9} metalness={0.1} />
      </mesh>,
    );
  }

  return <group ref={meshRef}>{meshes}</group>;
};

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
    <Canvas
      camera={{
        position: [ITC_CENTER.x, 200, ITC_CENTER.z + 200],
        fov: 60,
      }}
      shadows
    >
      <color attach="background" args={["#87CEEB"]} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[100, 200, 100]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={1000}
        shadow-camera-left={-500}
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
      />

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>

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
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        target={[ITC_CENTER.x, 0, ITC_CENTER.z]}
        minDistance={50}
        maxDistance={1000}
      />
    </Canvas>
  );
};

export default App;
