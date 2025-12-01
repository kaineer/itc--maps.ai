/**
 * AlignmentSliceLogger - Debug component for monitoring alignment slice state changes
 *
 * This component subscribes to alignment slice state and logs changes to console.
 * It should only be used during development/testing and removed in production.
 */

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/alignmentSlice";

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
    getSelectedModel,
    getSelectedPolygons,
    getPositionStep,
    getRotationStep,
    getScaleStep,
    getAlignmentTools,
    getAlignmentProgress,
  } = alignmentSlice.selectors;

  // Select all state we want to monitor
  const topCameraState = useSelector(getTopCameraState);
  const perspectiveCameraState = useSelector(getPerspectiveCameraState);
  const currentCameraView = useSelector(getCurrentCameraView);
  const modelTransform = useSelector(getModelTransform);
  const selectedModel = useSelector(getSelectedModel);
  const selectedPolygons = useSelector(getSelectedPolygons);
  const positionStep = useSelector(getPositionStep);
  const rotationStep = useSelector(getRotationStep);
  const scaleStep = useSelector(getScaleStep);
  const alignmentTools = useSelector(getAlignmentTools);
  const alignmentProgress = useSelector(getAlignmentProgress);

  // Log camera state changes
  useEffect(() => {
    if (!enabled || !logCameraState) return;

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
  }, [enabled, logCameraState, currentCameraView, topCameraState, perspectiveCameraState]);

  // Log model transform changes
  useEffect(() => {
    if (!enabled || !logModelTransform) return;

    console.group("🎯 Model Transform Update");
    console.log("Position:", modelTransform.position);
    console.log("Rotation:", modelTransform.rotation, "degrees");
    console.log("Scale:", modelTransform.scale);
    console.log("Selected Model:", selectedModel ? `Yes (${selectedModel.id})` : "No");
    console.log("Selected Polygons:", selectedPolygons.length);
    console.groupEnd();
  }, [enabled, logModelTransform, modelTransform, selectedModel, selectedPolygons]);

  // Log step configuration changes
  useEffect(() => {
    if (!enabled || !logStepConfig) return;

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
