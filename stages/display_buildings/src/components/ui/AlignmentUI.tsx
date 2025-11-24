import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Ground } from "../static/Ground";
import { Lighting } from "../static/Lighting";
import { AlignmentStage } from "../stage/ui/AlignmentStage";

import { Building } from "../../types/types";

interface Props {
  buildings: Building[];
  onModeChange?: () => void;
}

const ITC_CENTER = { x: -326.31, z: 668.04 };

export const AlignmentUI: React.FC<Props> = ({ buildings, onModeChange }) => {
  return (
    <>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <button
          onClick={onModeChange}
          style={{
            padding: "8px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Switch to View Mode
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

        {/* Alignment Stage - shows transparent polygons and models */}
        <AlignmentStage buildings={buildings} />

        {/* Controls - simplified for alignment mode */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[ITC_CENTER.x, 1.8, ITC_CENTER.z]}
        />
      </Canvas>
    </>
  );
};
