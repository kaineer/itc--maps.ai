/**
 * ViewControlsInfo component for displaying control information in View mode.
 *
 * This component shows the keyboard and mouse controls specific to the View mode,
 * where users can navigate the 3D environment using WASD keys and mouse controls.
 *
 * Uses the same structure as TopCameraControlInfo for consistency:
 * - CollapsibleControlInfo wrapper for hide/show functionality
 * - ControlInfoSection for organized control categories
 * - DetailedMetaInfo for additional information
 * - Consistent styling with other control info components
 */
import classes from "./ViewControlsInfo.module.css";

import { CollapsibleControlInfo } from "../../shared/ui/controlInfo/CollapsibleControlInfo";
import { Development } from "../../shared/Development";
import { ControlInfoSection } from "../../shared/ui/controlInfo/ControlInfoSection";
import { DetailedMetaInfo } from "../../shared/ui/controlInfo/DetailedMetaInfo";
import { LoggingInfoFooter } from "../../shared/ui/LoggingInfoFooter";
import { CAMERA_HEIGHTS, MOVEMENT_SPEEDS } from "../../../utils/constants";

const detailedInfo = [
  {
    title: "Camera Movement Speed",
    description: "Controls how fast the camera moves with WASD keys",
    normalSpeed: `${MOVEMENT_SPEEDS.BASE}m/s`,
    fastSpeed: `${MOVEMENT_SPEEDS.FAST}m/s (with Shift)`,
    modifier: "Hold Left Shift for 10× faster movement",
  },
  {
    title: "Camera Height",
    description: "Fixed camera height for consistent viewing perspective",
    eyeLevel: `${CAMERA_HEIGHTS.EYE_LEVEL}m (human eye level)`,
    note: "Height is fixed and cannot be changed in View mode",
  },
  {
    title: "Mouse Controls",
    description: "OrbitControls integration for intuitive camera manipulation",
    rotation: "Left click + drag",
    pan: "Right click + drag",
    zoom: "Mouse wheel",
  },
  // Test content for scroll testing
  {
    title: "Additional Test Section 1",
    description:
      "This is test content to make the panel longer for scroll testing",
    note: "Scroll should appear when content exceeds available height",
  },
  {
    title: "Additional Test Section 2",
    description:
      "More test content to ensure scroll functionality works properly",
    note: "Each section adds more height to the content area",
  },
  {
    title: "Additional Test Section 3",
    description: "Even more test content for comprehensive scroll testing",
    note: "The scrollbar should appear when this content is too tall",
  },
  {
    title: "Additional Test Section 4",
    description: "Test content to verify vertical scrolling implementation",
    note: "User should be able to scroll through all content",
  },
  {
    title: "Additional Test Section 5",
    description: "Final test section for scroll functionality validation",
    note: "If scroll doesn't work, check CSS height calculations",
  },
];

interface Props {
  showDetailed?: boolean;
  showCameraProperties?: boolean;
  showNavigationFeatures?: boolean;
  className?: string;
}

export const ViewControlsInfo = ({
  showDetailed = true,
  showCameraProperties = false,
  showNavigationFeatures = false,
  className = "",
}: Props) => {
  // Автоматически показывать дополнительные разделы при детализированном режиме
  const effectiveShowCameraProperties = showCameraProperties || showDetailed;
  const effectiveShowNavigationFeatures =
    showNavigationFeatures || showDetailed;
  const controls = [
    {
      category: "🎮 Movement Controls",
      items: [
        { keys: ["W"], description: "Move forward" },
        { keys: ["S"], description: "Move backward" },
        { keys: ["A"], description: "Move left (strafe)" },
        { keys: ["D"], description: "Move right (strafe)" },
        {
          keys: ["Shift", "Left", "+", "WASD"],
          description: "Fast movement (10× speed)",
        },
      ],
    },
    {
      category: "🖱️ Mouse Controls",
      items: [
        {
          keys: ["Mouse", "Left", "Click", "+", "Drag"],
          description: "Rotate camera around target",
        },
        {
          keys: ["Mouse", "Right", "Click", "+", "Drag"],
          description: "Pan camera (move up/down/left/right)",
        },
        {
          keys: ["Mouse", "Wheel"],
          description: "Zoom in/out",
        },
      ],
    },
  ];

  const content = (
    <>
      <h3 className={classes.title}>👁️ View Mode Controls</h3>

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

      {effectiveShowCameraProperties && (
        <ControlInfoSection
          key="camera-properties"
          category="📍 Camera Properties"
          items={[
            {
              keys: ["Fixed Height"],
              description: `Camera locked at ${CAMERA_HEIGHTS.EYE_LEVEL}m (eye level)`,
            },
            {
              keys: ["Layout Independent"],
              description:
                "Uses physical key codes (works with any keyboard layout)",
            },
          ]}
          className={classes.section}
        />
      )}

      {effectiveShowNavigationFeatures && (
        <ControlInfoSection
          key="navigation-features"
          category="🔍 Navigation Features"
          items={[
            {
              keys: ["Building Search"],
              description:
                "Search for buildings by address and move camera to them",
            },
            {
              keys: ["Auto Positioning"],
              description:
                "Camera automatically positions 10m north of found buildings",
            },
          ]}
          className={classes.section}
        />
      )}

      {showDetailed && (
        <div className={classes.detailedSection}>
          <h4 className={classes.detailedTitle}>📊 Detailed Information</h4>
          {detailedInfo.map((info, index) => (
            <div key={index} className={classes.detailedItem}>
              <div className={classes.detailedItemTitle}>{info.title}</div>
              <div className={classes.detailedItemDescription}>
                {info.description}
              </div>
              <DetailedMetaInfo
                data={info}
                prop="normalSpeed"
                title="Normal Speed"
              />
              <DetailedMetaInfo
                data={info}
                prop="fastSpeed"
                title="Fast Speed"
              />
              <DetailedMetaInfo data={info} prop="modifier" title="Modifier" />
              <DetailedMetaInfo data={info} prop="eyeLevel" title="Eye Level" />
              <DetailedMetaInfo data={info} prop="note" title="Note" />
              <DetailedMetaInfo data={info} prop="rotation" title="Rotation" />
              <DetailedMetaInfo data={info} prop="pan" title="Pan" />
              <DetailedMetaInfo data={info} prop="zoom" title="Zoom" />
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
    <CollapsibleControlInfo mode="viewControls" className={className}>
      {content}
      {/* Additional test content for scroll testing */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ margin: "0 0 10px 0", color: "#ffa726" }}>
          📋 Scroll Test Content
        </h4>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          This additional content is added to test scroll functionality.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          If scroll is working correctly, you should be able to scroll through
          all this content.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          The panel should have a maximum height of 80% of the viewport.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          When content exceeds this height, a scrollbar should appear.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 1 for scroll functionality verification.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 2 for scroll functionality verification.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 3 for scroll functionality verification.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 4 for scroll functionality verification.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 5 for scroll functionality verification.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 6 for scroll functionality verification.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 7 for scroll functionality verification.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 8 for scroll functionality verification.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 9 for scroll functionality verification.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#eee" }}>
          Test line 10 for scroll functionality verification.
        </p>
      </div>
    </CollapsibleControlInfo>
  );
};
