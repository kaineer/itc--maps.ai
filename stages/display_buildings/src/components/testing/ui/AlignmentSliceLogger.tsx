/**
 * AlignmentSliceLogger - Debug component for monitoring alignment slice state changes
 *
 * This component subscribes to alignment slice state and logs changes to console.
 * It should only be used during development/testing and removed in production.
 */

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { alignmentSlice } from "@slices/alignmentSlice";

interface Props {
  enabled?: boolean;
  logCameraState?: boolean;
  logModelTransform?: boolean;
  logStepConfig?: boolean;
  logProcessState?: boolean;
}

export const AlignmentSliceLogger = ({
  enabled = true,
  logCameraState = true,
  logModelTransform = true,
  logStepConfig = true,
  logProcessState = true,
}: Props) => {
  const {
    getTopCameraState,
    getPerspectiveCameraState,
    getCurrentCameraView,
    getModelTransform,
    getSelectedPolygons,
    getPositionStep,
    getRotationStep,
    getScaleStep,
  } = alignmentSlice.selectors;

  // Select all state we want to monitor
  const topCameraState = useSelector(getTopCameraState);
  const perspectiveCameraState = useSelector(getPerspectiveCameraState);
  const currentCameraView = useSelector(getCurrentCameraView);
  const modelTransform = useSelector(getModelTransform);
  const selectedPolygons = useSelector(getSelectedPolygons);
  const positionStep = useSelector(getPositionStep);
  const rotationStep = useSelector(getRotationStep);
  const scaleStep = useSelector(getScaleStep);

  // Log camera state changes
  useEffect(() => {
    if (!enabled || !logCameraState) return;

    // Log significant camera position changes outside group
    const [prevX, prevY, prevZ] = topCameraState.position;
    console.log(
      `📷 Camera moved to: [${prevX.toFixed(1)}, ${prevY.toFixed(1)}, ${prevZ.toFixed(1)}]`,
    );

    console.group("📷 Camera State Update");
    console.log("Current Camera View:", currentCameraView);
    console.log("Top Camera:", {
      position: topCameraState.position,
      target: topCameraState.target,
      fov: topCameraState.fov,
    });
    console.log("Perspective Camera:", {
      position: perspectiveCameraState.position,
      target: perspectiveCameraState.target,
      fov: perspectiveCameraState.fov,
    });
    console.groupEnd();
  }, [
    enabled,
    logCameraState,
    currentCameraView,
    topCameraState,
    perspectiveCameraState,
  ]);

  // Log model transform changes
  useEffect(() => {
    if (!enabled || !logModelTransform) return;

    // Log model position changes outside group
    const [posX, posY, posZ] = modelTransform.position;
    console.log(
      `🎯 Model at: [${posX.toFixed(1)}, ${posY.toFixed(1)}, ${posZ.toFixed(1)}], Rot: ${modelTransform.rotation}°, Scale: ${modelTransform.scale.toFixed(2)}`,
    );

    console.group("🎯 Model Transform Update");
    console.log("Position:", modelTransform.position);
    console.log("Rotation:", modelTransform.rotation, "degrees");
    console.log("Scale:", modelTransform.scale);
    console.log("Selected Polygons:", selectedPolygons.length);
    console.groupEnd();
  }, [enabled, logModelTransform, modelTransform, selectedPolygons]);

  // Log step configuration changes
  useEffect(() => {
    if (!enabled || !logStepConfig) return;

    // Log step changes outside group
    console.log(
      `⚙️ Position step: ${positionStep.toFixed(2)}m, Rotation: ${rotationStep}°, Scale: ${scaleStep}%`,
    );

    console.group("⚙️ Step Configuration Update");
    console.log("Position Step:", positionStep.toFixed(2), "meters");
    console.log("Rotation Step:", rotationStep, "degrees");
    console.log("Scale Step:", scaleStep, "%");
    console.groupEnd();
  }, [enabled, logStepConfig, positionStep, rotationStep, scaleStep]);

  // Log alignment tools and process state
  useEffect(() => {
    if (!enabled || !logProcessState) return;

    console.group("🛠️ Alignment Tools & Process");
    console.log("Tools:", alignmentTools);
    console.log("Progress:", alignmentProgress);
    console.groupEnd();
  }, [enabled, logProcessState, alignmentTools, alignmentProgress]);

  // Log initial state on mount
  useEffect(() => {
    if (!enabled) return;

    console.log("🚀 AlignmentSliceLogger mounted");
    console.log("📊 Initial State Summary:");
    console.log("- Position Step:", positionStep.toFixed(2), "meters");
    console.log("- Model Position:", modelTransform.position);
    console.log("- Top Camera Position:", topCameraState.position);
    console.log("- Selected Polygons:", selectedPolygons.length);

    return () => {
      console.log("👋 AlignmentSliceLogger unmounted");
    };
  }, [enabled]);

  // This component doesn't render anything
  return null;
};
