import styles from "./AlignmentUI.module.css";

import { Canvas } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { alignmentSlice } from "@slices/alignmentSlice";
import { uiSlice } from "@slices/uiSlice";

import { Ground } from "../../static/Ground";
import { Lighting } from "../../static/Lighting";

import { AlignmentStageContainer } from "../../stage/ui/AlignmentStageContainer";
import { AlignmentCameraGroup } from "../../cameras/alignment/AlignmentCameraGroup";
import { AlignmentUIGroup } from "./AlignmentUIGroup";

/**
 * AlignmentUI component for the alignment mode.
 *
 * This component renders the complete alignment interface:
 * 1. UI controls outside Canvas (AlignmentUIGroup)
 * 2. 3D scene inside Canvas with:
 *    - Lighting
 *    - Ground
 *    - Alignment stage (polygons + alignment model)
 *    - Alignment camera controllers
 *
 * The component reads camera state from Redux to initialize the Canvas camera.
 * All alignment state (selected polygons, model, transform) is managed by Redux.
 */
export const AlignmentUI = () => {
  const { getCurrentCamera } = alignmentSlice.selectors;
  const { getUIMode } = uiSlice.selectors;

  const currentCamera = useSelector(getCurrentCamera);
  const currentMode = useSelector(getUIMode);

  // Only render if we're in alignment mode
  if (currentMode !== "alignment") {
    return null;
  }

  return (
    <>
      {/* UI controls outside Canvas (camera info, controls, etc.) */}
      <AlignmentUIGroup enabled={true} />

      {/* 3D Canvas for alignment visualization */}
      <Canvas
        camera={{
          position: currentCamera.position,
          fov: currentCamera.fov,
          up: [0, 1, 0], // Y-up coordinate system
        }}
        shadows
        className={styles.canvas}
      >
        <color attach="background" args={["#f0f0f0"]} />

        {/* Lighting for the scene */}
        <Lighting />

        {/* Ground plane for reference */}
        <Ground position={currentCamera.position} />

        {/* Alignment stage: renders selected polygons and alignment model */}
        <AlignmentStageContainer enabled={true} />

        {/* Alignment camera controllers (switch between top/perspective) */}
        <AlignmentCameraGroup enabled={true} />
      </Canvas>
    </>
  );
};
