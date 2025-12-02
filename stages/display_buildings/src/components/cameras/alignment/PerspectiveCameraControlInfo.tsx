import classes from "./PerspectiveCameraControlInfo.module.css";

import { Fragment } from "react";
import { CollapsibleControlInfo } from "../../shared/ui/CollapsibleControlInfo";
import { Development } from "../../shared/Development";

const detailedInfo = [
  {
    title: "Camera Distance Control",
    description: "Controls how far the camera is from the model",
    operation: "W/S keys adjust distance",
    sensitivity: "Uses position step configuration",
  },
  {
    title: "Orbital Rotation",
    description: "Rotate camera around the model while maintaining distance",
    operation: "A/D keys for horizontal rotation",
    range: "Full 360° rotation",
  },
  {
    title: "Camera Height Toggle",
    description: "Switch between eye level and ground level perspectives",
    operation: "Space key toggles height",
    values: "Eye level (1.8m) ↔ Ground level (0.5m)",
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

export const PerspectiveCameraControlInfo = ({
  showDetailed = true,
  className = "",
}: Props) => {
  const controls = [
    {
      category: "🎥 Camera Movement",
      items: [
        { keys: ["W", "/", "S"], description: "Adjust camera distance" },
        { keys: ["A", "/", "D"], description: "Orbital rotation around model" },
        { keys: ["Space"], description: "Toggle camera height" },
      ],
    },
    {
      category: "🔄 View Switching",
      items: [
        { keys: ["Ctrl", "Space"], description: "Switch to top view" },
      ],
    },
    {
      category: "👁️ Perspective Modes",
      items: [
        { keys: ["Eye Level"], description: "1.8m height - human perspective" },
        { keys: ["Ground Level"], description: "0.5m height - ground contact view" },
      ],
    },
  ];

  const content = (
    <>
      <h3 className={classes.title}>👁️ Perspective Camera Controls</h3>

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
          <h4 className={classes.detailedTitle}>📊 Camera Configuration</h4>
          {detailedInfo.map((info, index) => (
            <div key={index} className={classes.detailedItem}>
              <div className={classes.detailedItemTitle}>{info.title}</div>
              <div className={classes.detailedItemDescription}>
                {info.description}
              </div>
              <DetailedMetaInfo data={info} prop="operation" title="Operation" />
              <DetailedMetaInfo data={info} prop="sensitivity" title="Sensitivity" />
              <DetailedMetaInfo data={info} prop="range" title="Range" />
              <DetailedMetaInfo data={info} prop="values" title="Values" />
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
    <CollapsibleControlInfo mode="perspectiveCameraControls" className={className}>
      {content}
    </CollapsibleControlInfo>
  );
};
