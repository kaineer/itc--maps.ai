import { useSelector } from "react-redux";
import { alignmentSlice } from "../../../store/alignmentSlice";
import { EnabledProps } from "../../shared/types";

const { getCurrentCameraView, getPerspectiveCameraState, getModelTransform } =
  alignmentSlice.selectors;

export const CameraTargetDebug = ({ enabled = true }: EnabledProps) => {
  const currentCameraView = useSelector(getCurrentCameraView);
  const perspectiveCameraState = useSelector(getPerspectiveCameraState);
  const modelTransform = useSelector(getModelTransform);

  if (!enabled) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 10000,
        maxWidth: "300px",
        maxHeight: "400px",
        overflow: "auto",
      }}
    >
      <div
        style={{ marginBottom: "10px", fontWeight: "bold", color: "#4fc3f7" }}
      >
        🎯 Camera Target Debug
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>Current View:</strong> {currentCameraView}
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>Model Position:</strong>
        <div style={{ marginLeft: "10px" }}>
          X: {modelTransform.position[0].toFixed(2)}
          <br />
          Y: {modelTransform.position[1].toFixed(2)}
          <br />
          Z: {modelTransform.position[2].toFixed(2)}
        </div>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <strong>Perspective Camera:</strong>
        <div style={{ marginLeft: "10px" }}>
          <div>
            <strong>Target:</strong>
            <br />
            X: {perspectiveCameraState.target[0].toFixed(2)}
            <br />
            Y: {perspectiveCameraState.target[1].toFixed(2)}
            <br />
            Z: {perspectiveCameraState.target[2].toFixed(2)}
          </div>
          <div style={{ marginTop: "5px" }}>
            <strong>Position:</strong>
            <br />
            X: {perspectiveCameraState.position[0].toFixed(2)}
            <br />
            Y: {perspectiveCameraState.position[1].toFixed(2)}
            <br />
            Z: {perspectiveCameraState.position[2].toFixed(2)}
          </div>
          <div style={{ marginTop: "5px" }}>
            <strong>Distance:</strong>{" "}
            {perspectiveCameraState.cameraDistance?.toFixed(2) || "N/A"}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "10px",
          paddingTop: "10px",
          borderTop: "1px solid #444",
        }}
      >
        <div style={{ fontSize: "10px", color: "#aaa" }}>
          <strong>Debug Info:</strong>
          <br />
          Target should match Model Position
          <br />
          Distance = √((ΔX)² + (ΔY)² + (ΔZ)²)
        </div>
      </div>
    </div>
  );
};
