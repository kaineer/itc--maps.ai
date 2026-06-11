/**
 * Help info about topCameraController
 */
import { CollapsibleControlInfo } from "@kit/control-info/CollapsibleControlInfo";
import classes from "./TopCameraControlInfo.module.css";
import { DetailedMetaInfo } from "@kit/control-info/DetailedMetaInfo";
import { ControlInfoSection } from "@kit/control-info/ControlInfoSection";

const detailedInfo = [
  {
    title: "Position Step Adjustment",
    description: "Controls how far the camera/model moves with each key press",
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
          keys: ["Alt", "W", "/", "S"],
          description: "Scale model (increase/decrease)",
        },
      ],
    },
    {
      category: "🔄 View Switching",
      items: [
        { keys: ["Ctrl", "Space"], description: "Switch to perspective view" },
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

  const content = (
    <>
      <h3 className={classes.title}>🎮 Top Camera Controls</h3>

      <div>
        {controls.map((section, sectionIndex) => (
          <ControlInfoSection
            key={sectionIndex}
            category={section.category}
            items={section.items}
            className={classes.section}
          />
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
              <DetailedMetaInfo data={info} prop="range" title="Range" />
              <DetailedMetaInfo data={info} prop="factor" title="Factor" />
              <DetailedMetaInfo data={info} prop="steps" title="Steps" />
              <DetailedMetaInfo data={info} prop="values" title="Values" />
              <DetailedMetaInfo data={info} prop="toggle" title="Toggle" />
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <CollapsibleControlInfo mode="topCameraControls" className={className}>
      {content}
    </CollapsibleControlInfo>
  );
};
