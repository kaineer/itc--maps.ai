import { ControlInfoSection } from "@kit/control-info/ControlInfoSection";
import classes from "./PerspectiveCameraControlInfo.module.css";
import { DetailedMetaInfo } from "@kit/control-info/DetailedMetaInfo";
import { CollapsibleControlInfo } from "@kit/control-info/CollapsibleControlInfo";

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
      items: [{ keys: ["Ctrl", "Space"], description: "Switch to top view" }],
    },
    {
      category: "👁️ Perspective Modes",
      items: [
        { keys: ["Eye Level"], description: "1.8m height - human perspective" },
        {
          keys: ["Ground Level"],
          description: "0.5m height - ground contact view",
        },
      ],
    },
  ];

  const content = (
    <>
      <h3 className={classes.title}>👁️ Perspective Camera Controls</h3>

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
          <h4 className={classes.detailedTitle}>📊 Camera Configuration</h4>
          {detailedInfo.map((info, index) => (
            <div key={index} className={classes.detailedItem}>
              <div className={classes.detailedItemTitle}>{info.title}</div>
              <div className={classes.detailedItemDescription}>
                {info.description}
              </div>
              <DetailedMetaInfo
                data={info}
                prop="operation"
                title="Operation"
              />
              <DetailedMetaInfo
                data={info}
                prop="sensitivity"
                title="Sensitivity"
              />
              <DetailedMetaInfo data={info} prop="range" title="Range" />
              <DetailedMetaInfo data={info} prop="values" title="Values" />
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <CollapsibleControlInfo
      mode="perspectiveCameraControls"
      className={className}
    >
      {content}
    </CollapsibleControlInfo>
  );
};
