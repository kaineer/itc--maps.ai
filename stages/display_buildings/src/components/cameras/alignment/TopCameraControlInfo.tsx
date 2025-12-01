import React from "react";
import { CollapsibleControlInfo } from "../../shared/ui/CollapsibleControlInfo";

interface Props {
  showDetailed?: boolean;
  className?: string;
}

export const TopCameraControlInfo = ({
  showDetailed = true,
  className = "",
}: Props) => {
  const controls = [
    {
      category: "🎥 Camera Movement",
      items: [
        { keys: ["W", "A", "S", "D"], description: "Move camera in top view" },
      ],
    },
    {
      category: "🏗️ Model Transformation",
      items: [
        { keys: ["Shift", "W", "A", "S", "D"], description: "Move model" },
        { keys: ["Ctrl", "A", "/", "D"], description: "Rotate model (Y-axis)" },
        {
          keys: ["Ctrl", "W", "/", "S"],
          description: "Scale model (increase/decrease)",
        },
      ],
    },
    {
      category: "⚙️ Step Configuration",
      items: [
        {
          keys: ["Shift", "↑", "/", "↓"],
          description: "Position step (0.5-20m)",
        },
        {
          keys: ["Ctrl", "↑", "/", "↓"],
          description: "Rotation step (1°-90°)",
        },
        {
          keys: ["Ctrl", "Shift", "↑"],
          description: "Toggle scale step (1% ↔ 5%)",
        },
      ],
    },
  ];

  const detailedInfo = [
    {
      title: "Position Step Adjustment",
      description:
        "Controls how far the camera/model moves with each key press",
      range: "0.5m to 20m",
      factor: "×1.5 multiplier",
    },
    {
      title: "Rotation Step Adjustment",
      description: "Controls how much the model rotates with each key press",
      steps: "1°, 2°, 5°, 10°, 15°, 30°, 60°, 90°",
    },
    {
      title: "Scale Step Adjustment",
      description: "Controls how much the model scales with each key press",
      values: "1% or 5%",
      toggle: "Ctrl+Shift+↑ toggles between values",
    },
  ];

  const content = (
    <>
      <h3
        style={{
          marginTop: 0,
          marginBottom: "20px",
          color: "#4fc3f7",
          borderBottom: "2px solid #4fc3f7",
          paddingBottom: "8px",
        }}
      >
        🎮 Top Camera Controls
      </h3>

      <div style={{ marginBottom: "20px" }}>
        {controls.map((section, sectionIndex) => (
          <div key={sectionIndex} style={{ marginBottom: "16px" }}>
            <h4
              style={{
                margin: "0 0 8px 0",
                color: "#81c784",
                fontSize: "14px",
              }}
            >
              {section.category}
            </h4>
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                  paddingLeft: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    marginRight: "12px",
                    minWidth: "120px",
                  }}
                >
                  {item.keys.map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      {keyIndex > 0 && key !== "/" && (
                        <span style={{ margin: "0 2px" }}>+</span>
                      )}
                      {key === "/" ? (
                        <span style={{ margin: "0 4px", color: "#bbb" }}>
                          /
                        </span>
                      ) : (
                        <kbd
                          style={{
                            backgroundColor: "#333",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            border: "1px solid #555",
                            fontSize: "12px",
                            minWidth: "24px",
                            textAlign: "center",
                            display: "inline-block",
                          }}
                        >
                          {key}
                        </kbd>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <span style={{ color: "#e0e0e0" }}>{item.description}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showDetailed && (
        <div
          style={{
            borderTop: "1px solid #444",
            paddingTop: "16px",
            marginTop: "16px",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px 0",
              color: "#ffb74d",
              fontSize: "14px",
            }}
          >
            📊 Detailed Configuration
          </h4>
          {detailedInfo.map((info, index) => (
            <div
              key={index}
              style={{
                marginBottom: "12px",
                padding: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  color: "#ffb74d",
                  marginBottom: "4px",
                }}
              >
                {info.title}
              </div>
              <div style={{ color: "#ccc", marginBottom: "4px" }}>
                {info.description}
              </div>
              {info.range && (
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  <strong>Range:</strong> {info.range}
                </div>
              )}
              {info.factor && (
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  <strong>Factor:</strong> {info.factor}
                </div>
              )}
              {info.steps && (
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  <strong>Steps:</strong> {info.steps}
                </div>
              )}
              {info.values && (
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  <strong>Values:</strong> {info.values}
                </div>
              )}
              {info.toggle && (
                <div style={{ fontSize: "12px", color: "#aaa" }}>
                  <strong>Toggle:</strong> {info.toggle}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: "16px",
          paddingTop: "12px",
          borderTop: "1px solid #444",
          fontSize: "12px",
          color: "#888",
          textAlign: "center",
        }}
      >
        <div>All changes are logged in console</div>
        <div>Use AlignmentSliceLogger for detailed state monitoring</div>
      </div>
    </>
  );

  return (
    <CollapsibleControlInfo
      mode="topCameraControls"
      position="top-left"
      className={className}
    >
      {content}
    </CollapsibleControlInfo>
  );
};
