import React from "react";
import { CollapsibleControlInfo } from "../../shared/ui/CollapsibleControlInfo";
import clsx from "clsx";
import classes from "./TopCameraControlInfo.module.css";

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
      <h3 className={classes.title}>🎮 Top Camera Controls</h3>

      <div>
        {controls.map((section, sectionIndex) => (
          <div key={sectionIndex} className={classes.section}>
            <h4 className={classes.sectionTitle}>{section.category}</h4>
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className={classes.controlItem}>
                <div className={classes.keysContainer}>
                  {item.keys.map((key, keyIndex) => (
                    <React.Fragment key={keyIndex}>
                      {keyIndex > 0 && key !== "/" && (
                        <span className={classes.keySeparator}>+</span>
                      )}
                      {key === "/" ? (
                        <span className={classes.slashSeparator}>/</span>
                      ) : (
                        <kbd className={classes.key}>{key}</kbd>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <span className={classes.description}>{item.description}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showDetailed && (
        <div className={classes.detailedSection}>
          <h4 className={classes.detailedTitle}>📊 Detailed Configuration</h4>
          {detailedInfo.map((info, index) => (
            <div key={index} className={classes.detailedItem}>
              <div className={classes.detailedItemTitle}>{info.title}</div>
              <div className={classes.detailedItemDescription}>
                {info.description}
              </div>
              {info.range && (
                <div className={classes.detailedItemMeta}>
                  <strong>Range:</strong> {info.range}
                </div>
              )}
              {info.factor && (
                <div className={classes.detailedItemMeta}>
                  <strong>Factor:</strong> {info.factor}
                </div>
              )}
              {info.steps && (
                <div className={classes.detailedItemMeta}>
                  <strong>Steps:</strong> {info.steps}
                </div>
              )}
              {info.values && (
                <div className={classes.detailedItemMeta}>
                  <strong>Values:</strong> {info.values}
                </div>
              )}
              {info.toggle && (
                <div className={classes.detailedItemMeta}>
                  <strong>Toggle:</strong> {info.toggle}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={classes.footer}>
        <div className={classes.footerText}>
          All changes are logged in console
        </div>
        <div className={classes.footerText}>
          Use AlignmentSliceLogger for detailed state monitoring
        </div>
      </div>
    </>
  );

  return (
    <CollapsibleControlInfo mode="topCameraControls" className={className}>
      {content}
    </CollapsibleControlInfo>
  );
};
