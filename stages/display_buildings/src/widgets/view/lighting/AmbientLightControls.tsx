import classes from "./AmbientLightControls.module.css";
import type { ChangeEvent } from "react";

interface Props {
  intensity: number;
  color: string;
  onIntensityChange: (intensity: number) => void;
  onColorChange: (color: string) => void;
  minIntensity?: number;
  maxIntensity?: number;
  step?: number;
}

export const AmbientLightControls = ({
  intensity,
  color,
  onIntensityChange,
  onColorChange,
  minIntensity = 0,
  maxIntensity = 10,
  step = 0.1,
}: Props) => {
  const handleIntensityChange = (event: ChangeEvent<HTMLInputElement>) => {
    onIntensityChange(Number(event.target.value));
  };

  const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    onColorChange(event.target.value);
  };

  return (
    <div className={classes.panel}>
      <h3 className={classes.title}>Ambient-освещение</h3>

      <label className={classes.field}>
        <span className={classes.labelRow}>
          <span>Интенсивность</span>
          <span className={classes.value}>{intensity.toFixed(1)}</span>
        </span>
        <input
          className={classes.slider}
          type="range"
          min={minIntensity}
          max={maxIntensity}
          step={step}
          value={intensity}
          onChange={handleIntensityChange}
          aria-label="Интенсивность ambient-освещения"
        />
      </label>

      <label className={classes.field}>
        <span className={classes.labelRow}>
          <span>Цвет</span>
          <span className={classes.value}>{color}</span>
        </span>
        <input
          className={classes.colorInput}
          type="color"
          value={color}
          onChange={handleColorChange}
          aria-label="Цвет ambient-освещения"
        />
      </label>
    </div>
  );
};
