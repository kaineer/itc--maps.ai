import { CenteredForm } from "@components/shared/ui/CenteredForm";
import classes from "./EditPolygon.module.css";
import { useCallback, useEffect, useState } from "react";
import { usePatchPolygonMutation } from "@store/api/BuildingsApi";
import { useSelector } from "react-redux";
import { Building } from "@.types/buildings-types";
import { alignmentSlice } from "@slices/alignmentSlice";

interface Props {
  enabled: boolean;
  onClose?: () => void;
}

export const EditPolygon = ({ enabled, onClose = () => null }: Props) => {
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
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  if (!polygon) return null;

  return (
    <CenteredForm enabled={enabled} onClose={onClose}>
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
    </CenteredForm>
  );
};
