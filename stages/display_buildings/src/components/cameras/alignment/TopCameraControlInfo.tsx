import classes from "./TopCameraControlInfo.module.css";

import { Fragment } from "react";
import { CollapsibleControlInfo } from "../../shared/ui/CollapsibleControlInfo";
import { Development } from "../../shared/Development";

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

interface DetailedMetaProps {
  data: Record<string, string | undefined>;
  prop: string;
  title: string;
}

const DetailedMetaInfo = ({ data, prop, title }: DetailedMetaProps) => {
  const value = data[prop];

  if (!value) {
    return null;
  }

  return (
    <div className={classes.detailedItemMeta}>
      <strong>{title}:</strong> {value}
    </div>
  );
};

const LoggingInfoFooter = () => {
  return (
    <div className={classes.footer}>
      <div className={classes.footerText}>
        All changes are logged in console
      </div>
      <div className={classes.footerText}>
        Use AlignmentSliceLogger for detailed state monitoring
      </div>
    </div>
  );
};

interface KeysDisplayProps {
  keys: string[];
}

const KeysDisplay = ({ keys }: KeysDisplayProps) => {
  return (
    <div className={classes.keysContainer}>
      {keys.map((key, keyIndex) => (
        <Fragment key={keyIndex}>
          {keyIndex > 0 && key !== "/" && keys[keyIndex - 1] !== "/" && (
            <span className={classes.keySeparator}>+</span>
          )}
          {key === "/" ? (
            <span className={classes.slashSeparator}>/</span>
          ) : (
            <kbd className={classes.key}>{key}</kbd>
          )}
        </Fragment>
      ))}
    </div>
  );
};

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
          <div key={sectionIndex} className={classes.section}>
            <h4 className={classes.sectionTitle}>{section.category}</h4>
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className={classes.controlItem}>
                <KeysDisplay keys={item.keys} />
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
              <DetailedMetaInfo data={info} prop="range" title="Range" />
              <DetailedMetaInfo data={info} prop="factor" title="Factor" />
              <DetailedMetaInfo data={info} prop="steps" title="Steps" />
              <DetailedMetaInfo data={info} prop="values" title="Values" />
              <DetailedMetaInfo data={info} prop="toggle" title="Toggle" />
            </div>
          ))}
        </div>
      )}

      <Development>
        <LoggingInfoFooter />
      </Development>
    </>
  );

  return (
    <CollapsibleControlInfo mode="topCameraControls" className={className}>
      {content}
    </CollapsibleControlInfo>
  );
};
