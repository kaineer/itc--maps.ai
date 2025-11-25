import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useSelector } from "react-redux";
import { Ground } from "../static/Ground";
import { Lighting } from "../static/Lighting";
import { AlignmentStage } from "../stage/ui/AlignmentStage";
import { CameraControls } from "./CameraControls";
import { getCurrentCamera } from "../../store/alignmentSlice";
import { RootState } from "../../store";

import { Building } from "../../types/types";

interface Props {
  buildings: Building[];
  onModeChange?: () => void;
}

export const AlignmentUI: React.FC<Props> = ({ buildings, onModeChange }) => {
  const currentCamera = useSelector((state: RootState) =>
    getCurrentCamera(state),
  );

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

      <CameraControls />

      <Canvas
        camera={{
          position: currentCamera.position,
          fov: currentCamera.fov,
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
          target={currentCamera.target}
        />
      </Canvas>
    </>
  );
};
