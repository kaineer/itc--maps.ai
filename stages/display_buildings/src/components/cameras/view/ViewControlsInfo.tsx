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
import { FeatureInfoSection } from "../../shared/ui/controlInfo/FeatureInfoSection";
import { DetailedMetaInfo } from "../../shared/ui/controlInfo/DetailedMetaInfo";
import { LoggingInfoFooter } from "../../shared/ui/LoggingInfoFooter";
import { CAMERA_HEIGHTS, MOVEMENT_SPEEDS } from "@utils/constants";

const detailedInfo = [
  {
    title: "Скорость движения камеры",
    description: "Управляет скоростью движения камеры с помощью клавиш WASD",
    normalSpeed: `${MOVEMENT_SPEEDS.BASE}м/с`,
    fastSpeed: `${MOVEMENT_SPEEDS.FAST}м/с (с Shift)`,
    modifier: "Удерживайте Left Shift для движения в 10 раз быстрее",
  },
  {
    title: "Высота камеры",
    description:
      "Фиксированная высота камеры для постоянной перспективы обзора",
    eyeLevel: `${CAMERA_HEIGHTS.EYE_LEVEL}м (уровень глаз человека)`,
    note: "Высота фиксирована и не может быть изменена в режиме просмотра",
  },
  {
    title: "Управление мышью",
    description: "Интеграция OrbitControls для интуитивного управления камерой",
    rotation: "Левая кнопка мыши + перетаскивание",
    pan: "Правая кнопка мыши + перетаскивание",
    zoom: "Колесико мыши",
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
      category: "🎮 Управление движением",
      items: [
        {
          keys: ["WASD"],
          description: "Движение вперед/назад/влево/вправо",
        },
        {
          keys: ["LeftShift", "WASD"],
          description: "Быстрое движение (в 10 раз быстрее)",
        },
      ],
    },
    {
      category: "🖱️ Управление мышью",
      items: [
        {
          keys: ["ЛКМ", "Перетаскивание"],
          description: "Вращение камеры вокруг цели",
        },
        {
          keys: ["ПКМ", "Перетаскивание"],
          description:
            "Панорамирование камеры (движение вверх/вниз/влево/вправо)",
        },
        {
          keys: ["Колесико мыши"],
          description: "Приближение/отдаление",
        },
      ],
    },
  ];

  const content = (
    <>
      <h3 className={classes.title}>👁️ Управление в режиме просмотра</h3>

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
        <FeatureInfoSection
          key="camera-properties"
          category="📍 Свойства камеры"
          items={[
            {
              title: "Фиксированная высота",
              description: `Камера зафиксирована на высоте ${CAMERA_HEIGHTS.EYE_LEVEL}м (уровень глаз)`,
            },
            {
              title: "Независимость от раскладки",
              description:
                "Использует физические коды клавиш (работает с любой раскладкой клавиатуры)",
            },
          ]}
          className={classes.section}
        />
      )}

      {effectiveShowNavigationFeatures && (
        <FeatureInfoSection
          key="navigation-features"
          category="🔍 Функции навигации"
          items={[
            {
              title: "Поиск зданий",
              description: "Поиск зданий по адресу и перемещение камеры к ним",
            },
            {
              title: "Автоматическое позиционирование",
              description:
                "Камера автоматически позиционируется в 10 метрах к северу от найденных зданий",
            },
          ]}
          className={classes.section}
        />
      )}

      {showDetailed && (
        <div className={classes.detailedSection}>
          <h4 className={classes.detailedTitle}>📊 Подробная информация</h4>
          {detailedInfo.map((info, index) => (
            <div key={index} className={classes.detailedItem}>
              <div className={classes.detailedItemTitle}>{info.title}</div>
              <div className={classes.detailedItemDescription}>
                {info.description}
              </div>
              <DetailedMetaInfo
                data={info}
                prop="normalSpeed"
                title="Обычная скорость"
              />
              <DetailedMetaInfo
                data={info}
                prop="fastSpeed"
                title="Быстрая скорость"
              />
              <DetailedMetaInfo
                data={info}
                prop="modifier"
                title="Модификатор"
              />
              <DetailedMetaInfo
                data={info}
                prop="eyeLevel"
                title="Уровень глаз"
              />
              <DetailedMetaInfo data={info} prop="note" title="Примечание" />
              <DetailedMetaInfo data={info} prop="rotation" title="Вращение" />
              <DetailedMetaInfo
                data={info}
                prop="pan"
                title="Панорамирование"
              />
              <DetailedMetaInfo
                data={info}
                prop="zoom"
                title="Масштабирование"
              />
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
    </CollapsibleControlInfo>
  );
};
