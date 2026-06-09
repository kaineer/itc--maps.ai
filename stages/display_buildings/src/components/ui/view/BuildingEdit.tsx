import classes from "./BuildingEdit.module.css";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { CollapsibleForm } from "@components/shared/ui/CollapsibleForm";
import { alignmentSlice } from "@slices/alignmentSlice";
import { useSelector } from "react-redux";
import { Building } from "@.types/buildings-types";
import { Allow } from "@components/shared/Allow";
import { bind } from "@utils/bind";
import { usePatchPolygonMutation } from "@entities/buildings/model/buildings.api";

interface Props {
  enabled?: boolean;
  className?: string;
  onToggled: (value: boolean) => void;
}

/**
 * BuildingEdit component for editing polygon properties.
 *
 * Features:
 * - Form for editing polygon height and address
 * - Save button for submitting changes
 * - Collapsible interface (always starts collapsed)
 * - Error and success message display
 */
export const BuildingEdit = ({
  enabled = true,
  className = "",
  onToggled,
}: Props) => {
  const [height, setHeight] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { getSelectedPolygons } = alignmentSlice.selectors;
  const selectedPolygons: Building[] = useSelector(getSelectedPolygons);
  const polygon = selectedPolygons.length === 1 ? selectedPolygons[0] : "";

  const [updateBuilding] = usePatchPolygonMutation();

  useEffect(() => {
    if (polygon) {
      setAddress(polygon.address || "");
      setHeight(String(polygon.height / 3));
    }
  }, [polygon]);

  /**
   * Handle save button click
   * For now, just shows success message without actual API call
   */
  const handleSave = () => {
    if (!polygon) return;

    // Validate inputs
    if (!height.trim() && !address.trim()) {
      setError("Введите хотя бы одно значение для сохранения");
      setSuccess(null);
      return;
    }

    // Validate height is a positive number if provided
    if (height.trim()) {
      const heightValue = parseFloat(height);
      if (isNaN(heightValue) || heightValue <= 0) {
        setError("Высота должна быть положительным числом и задана в этажах");
        setSuccess(null);
        return;
      }
    }

    setIsSaving(true);
    setError(null);

    updateBuilding({
      id: polygon?.id,
      address: address.trim() || null,
      height: Number(height) * 3 || null,
    }).then(() => {
      const changes = [];
      if (height.trim()) changes.push(`высоту: ${height} этажей`);
      if (address.trim()) changes.push(`адрес: "${address}"`);

      setSuccess(`Изменения сохранены: ${changes.join(", ")}`);
      setIsSaving(false);
    });
  };

  /**
   * Clear all form fields and messages
   */
  const clearForm = () => {
    setHeight("1");
    setAddress("");
    setError(null);
    setSuccess(null);
  };

  const isFormValid = useCallback(() => {
    return height.trim() !== "" || address.trim() !== "";
  }, [height, address]);

  /**
   * Handle Enter key press in form inputs
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) =>
    bind({
      Enter: handleSave,
    })(event);

  if (!polygon) return null;

  return (
    <Allow role="Admin,Creator">
      <CollapsibleForm
        enabled={enabled}
        className={clsx(classes.container, className)}
        collapsedClassName={classes.collapsed}
        expandedClassName={classes.expanded}
        collapsed={{
          buttonText: "✏️",
          title: "Нажмите для редактирования полигона",
        }}
        closeTitle="Скрыть форму редактирования"
        onToggled={onToggled}
      >
        <div className={classes.editHeader}>
          <h3 className={classes.title}>Исправить здание</h3>
          <p className={classes.subtitle}>
            Введите новые значения для высоты (в этажах) и/или адреса полигона
          </p>
        </div>

        <div className={classes.editForm}>
          <div className={classes.formGroup}>
            <label className={classes.formLabel} htmlFor="height-input">
              Высота полигона (этажи)
            </label>
            <input
              id="height-input"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="количество этажей"
              className={classes.formInput}
              disabled={isSaving}
              min="1"
              step="1"
            />
          </div>

          <div className={classes.formGroup}>
            <label className={classes.formLabel} htmlFor="address-input">
              Адрес полигона
            </label>
            <input
              id="address-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="например, Чкалова, 3"
              className={classes.formInput}
              disabled={isSaving}
            />
          </div>

          {(height || address) && (
            <button
              onClick={clearForm}
              className={classes.clearButton}
              disabled={isSaving}
            >
              Очистить форму
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || !isFormValid()}
            className={classes.saveButton}
          >
            {isSaving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>

        {error && (
          <div className={classes.errorMessage}>
            <span className={classes.errorIcon}>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className={classes.successMessage}>
            <span className={classes.successIcon}>✅</span>
            {success}
          </div>
        )}

        {!error && !success && (
          <div className={classes.hint}>
            <span className={classes.hintIcon}>💡</span>
            <span className={classes.hintText}>
              Заполните хотя бы одно поле для сохранения изменений.
              <br />
              Высота должна быть положительным числом.
            </span>
          </div>
        )}
      </CollapsibleForm>
    </Allow>
  );
};
