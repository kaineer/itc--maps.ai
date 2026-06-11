import React from "react";
import classes from "./FeatureInfoSection.module.css";

interface FeatureItem {
  title: string;
  description: string;
}

interface Props {
  category: string;
  items: FeatureItem[];
  className?: string;
}

/**
 * FeatureInfoSection component for displaying feature descriptions without keyboard styling.
 *
 * Features:
 * - Clean display of feature titles and descriptions
 * - No keyboard key styling (unlike ControlInfoSection)
 * - Consistent styling with other info sections
 * - Responsive design
 *
 * Usage:
 * ```tsx
 * <FeatureInfoSection
 *   category="📍 Свойства камеры"
 *   items={[
 *     { title: "Фиксированная высота", description: "Камера зафиксирована на высоте 1.8м" },
 *     { title: "Независимость от раскладки", description: "Работает с любой раскладкой клавиатуры" },
 *   ]}
 * />
 * ```
 */
export const FeatureInfoSection = ({
  category,
  items,
  className = "",
}: Props) => {
  return (
    <div className={`${classes.section} ${className}`}>
      <h4 className={classes.sectionTitle}>{category}</h4>
      {items.map((item, itemIndex) => (
        <div key={itemIndex} className={classes.featureItem}>
          <div className={classes.featureTitle}>{item.title}</div>
          <div className={classes.featureDescription}>{item.description}</div>
        </div>
      ))}
    </div>
  );
};
