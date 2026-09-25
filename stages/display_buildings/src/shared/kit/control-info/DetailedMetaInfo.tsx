import classes from "./DetailedMetaInfo.module.css";

interface DetailedMetaInfoProps {
  data: Record<string, string | undefined>;
  prop: string;
  title: string;
}

/**
 * DetailedMetaInfo component for displaying metadata in control info panels.
 *
 * Features:
 * - Consistent styling for metadata display
 * - Conditional rendering when value is undefined
 * - Clean, readable format for configuration details
 *
 * Usage:
 * ```tsx
 * <DetailedMetaInfo
 *   data={info}
 *   prop="range"
 *   title="Range"
 * />
 * ```
 */
export const DetailedMetaInfo = ({ data, prop, title }: DetailedMetaInfoProps) => {
  const value = data[prop];

  if (!value) {
    return null;
  }

  return (
    <div className={classes.detailedItemMeta}>
      <strong className={classes.metaTitle}>{title}:</strong>{" "}
      <span className={classes.metaValue}>{value}</span>
    </div>
  );
};
