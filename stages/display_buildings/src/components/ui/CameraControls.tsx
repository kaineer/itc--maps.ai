import { useDispatch, useSelector } from "react-redux";
import { alignmentSlice } from "../../store/alignmentSlice";

const {
  selectors: { getCurrentCamera, getCurrentCameraView },
  actions: { setCameraView, resetCamera, resetAllCameras },
} = alignmentSlice;

export const CameraControls = () => {
  const dispatch = useDispatch();
  const currentCamera = useSelector(getCurrentCamera);
  const currentCameraView = useSelector(getCurrentCameraView);

  const cameraViews = [
    { id: "perspective" as const, label: "Perspective", icon: "👁️" },
    { id: "top" as const, label: "Top View", icon: "⬇️" },
  ];

  const handleCameraChange = (view: "perspective" | "top") => {
    dispatch(setCameraView(view));
  };

  const handleResetCamera = () => {
    dispatch(resetCamera(currentCameraView));
  };

  const handleResetAllCameras = () => {
    dispatch(resetAllCameras());
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 10,
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        minWidth: "200px",
      }}
    >
      <h3
        style={{
          margin: "0 0 12px 0",
          fontSize: "14px",
          fontWeight: "600",
          color: "#333",
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "8px",
        }}
      >
        Camera Controls
      </h3>

      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            fontSize: "12px",
            color: "#666",
            marginBottom: "8px",
            fontWeight: "500",
          }}
        >
          Camera Views
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {cameraViews.map((camera) => (
            <button
              key={camera.id}
              onClick={() => handleCameraChange(camera.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                backgroundColor:
                  currentCameraView === camera.id ? "#007bff" : "#f8f9fa",
                color: currentCameraView === camera.id ? "white" : "#333",
                border: `1px solid ${currentCameraView === camera.id ? "#007bff" : "#ddd"}`,
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: currentCameraView === camera.id ? "600" : "400",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: "14px" }}>{camera.icon}</span>
              {camera.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          borderTop: "1px solid #e0e0e0",
          paddingTop: "12px",
        }}
      >
        <button
          onClick={handleResetCamera}
          style={{
            flex: 1,
            padding: "6px 10px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "500",
          }}
        >
          Reset Current
        </button>
        <button
          onClick={handleResetAllCameras}
          style={{
            flex: 1,
            padding: "6px 10px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "500",
          }}
        >
          Reset All
        </button>
      </div>

      <div
        style={{
          marginTop: "12px",
          padding: "8px",
          backgroundColor: "#f8f9fa",
          borderRadius: "4px",
          fontSize: "10px",
          color: "#666",
          border: "1px solid #e9ecef",
        }}
      >
        <div style={{ fontWeight: "600", marginBottom: "4px" }}>
          Current Camera:
        </div>
        <div>Position: [{currentCamera.position.join(", ")}]</div>
        <div>Target: [{currentCamera.target.join(", ")}]</div>
        <div>FOV: {currentCamera.fov}°</div>
      </div>
    </div>
  );
};
