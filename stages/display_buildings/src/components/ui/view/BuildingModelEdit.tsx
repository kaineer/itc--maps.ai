import classes from "./BuildingEdit.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { CollapsibleForm } from "@components/shared/ui/CollapsibleForm";
import { alignmentSlice } from "@slices/alignmentSlice";
import { useSelector } from "react-redux";
import {
  Building,
  isBuildingWithModel,
  ModelMetadata,
  UpdateModel,
} from "@.types/buildings-types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import {
  useDeleteModelMutation,
  useUpdateModelPositionMutation,
} from "@store/api/ModelsApi";
import { toast } from "sonner";

interface Props {
  enabled?: boolean;
  className?: string;
  onToggled: (value: boolean) => void;
}

/**
 * BuildingModelEdit component for editing model properties.
 *
 * Features:
 * - Form for editing model rotation, scale, and ground level
 * - Address field (read-only or editable)
 * - Delete model button
 * - Save button for submitting changes
 * - Collapsible interface (always starts collapsed)
 * - Error and success message display
 */
export const BuildingModelEdit = ({
  enabled = true,
  className = "",
  onToggled,
}: Props) => {
  const [rotation, setRotation] = useState<string>("");
  const [scale, setScale] = useState<string>("");
  const [groundLevel, setGroundLevel] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<
    (ModelMetadata & { address: string | null }) | null
  >(null);
  const [showMetadata, setShowMetadata] = useState<boolean>(false);

  const metadataRef = useRef<HTMLTextAreaElement>(null);

  const { getModelToEdit } = alignmentSlice.selectors;
  const { dropModelToEdit } = alignmentSlice.actions;
  const building: Building | null = useSelector(getModelToEdit);

  const dispatch = useDispatch<AppDispatch>();
  const [removeModel] = useDeleteModelMutation();
  const [updateModel] = useUpdateModelPositionMutation();

  useEffect(() => {
    if (building && building.model && building.modelMetadata) {
      const { rotation: rot, scale: scl, position } = building.modelMetadata;
      setAddress(building.address || "");

      // Rotation - берем Y компонент (вертикальное вращение)
      setRotation(String(rot[1] || 0));

      // Scale
      setScale(String(scl || 1));

      // Ground level - Y компонент позиции (высота над землей)
      setGroundLevel(String(position[1] || 0));

      setMetadata({
        position: building.modelMetadata.position,
        rotation: building.modelMetadata.rotation,
        scale: building.modelMetadata.scale,
        address: building.address,
      });
    }
  }, [building]);

  /**
   * Handle save button click
   */
  const handleSave = () => {
    if (!building || !building.model || !building.modelMetadata) return;

    // Validate inputs
    const rotationValue = parseFloat(rotation);
    const scaleValue = parseFloat(scale);
    const groundLevelValue = parseFloat(groundLevel);

    if (isNaN(rotationValue)) {
      setError("Поворот должен быть числом");
      setSuccess(null);
      return;
    }

    if (isNaN(scaleValue) || scaleValue <= 0) {
      setError("Масштаб должен быть положительным числом");
      setSuccess(null);
      return;
    }

    if (isNaN(groundLevelValue)) {
      setError("Уровень над землей должен быть числом");
      setSuccess(null);
      return;
    }

    setIsSaving(true);
    setError(null);

    const updatedMetadata: UpdateModel = {
      id: building.model,
      polygons: building.polygons,
      position: [
        building.modelMetadata.position[0],
        groundLevelValue,
        building.modelMetadata.position[2],
      ],
      rotation: rotationValue,
      scale: scaleValue,
      address: building.address || void 0,
    };

    updateModel(updatedMetadata)
      .then(() => {
        const changes = [];
        if (rotation.trim()) changes.push(`поворот: ${rotation}°`);
        if (scale.trim()) changes.push(`масштаб: ${scale}`);
        if (groundLevel.trim()) changes.push(`уровень: ${groundLevel}`);

        setSuccess(`Изменения сохранены: ${changes.join(", ")}`);

        toast.info("Изменения сохранены", {
          description: changes.join(", "),
          duration: 10000,
        });

        setIsSaving(false);
      })
      .catch((err: any) => {
        setError(`Ошибка сохранения: ${err.message || "Неизвестная ошибка"}`);
        setIsSaving(false);
      })
      .finally(() => {
        dispatch(dropModelToEdit());
      });
  };

  const importMetadata = () => {
    if (metadataRef.current) {
      const { position, rotation, scale, address } = JSON.parse(
        metadataRef.current.value,
      );

      if (building && isBuildingWithModel(building)) {
        const updatedMetadata: UpdateModel = {
          id: building.model,
          polygons: building.polygons,
          position,
          rotation: (rotation as [number, number, number])[1],
          scale,
          address,
        };
        updateModel(updatedMetadata);
      }
    }
  };

  /**
   * Handle delete model button click
   */
  const handleDelete = async () => {
    if (!building || !building.model) return;

    setIsDeleting(true);
    setError(null);

    await removeModel(building.model);
    setSuccess("Модель помечена для удаления (функция в разработке)");
    setIsDeleting(false);
  };

  /**
   * Clear all form fields and messages
   */
  const clearForm = () => {
    if (building && building.model && building.modelMetadata) {
      setRotation(String(building.modelMetadata.rotation[1] || 0));
      setScale(String(building.modelMetadata.scale || 1));
      setGroundLevel(String(building.modelMetadata.position[1] || 0));
    } else {
      setRotation("0");
      setScale("1");
      setGroundLevel("0");
    }
    setError(null);
    setSuccess(null);
  };

  const isFormValid = useCallback(() => {
    return (
      rotation.trim() !== "" || scale.trim() !== "" || groundLevel.trim() !== ""
    );
  }, [rotation, scale, groundLevel]);

  /**
   * Handle Enter key press in form inputs
   */
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  const toggleMetadata = (e) => {
    if (e.ctrlKey) {
      setShowMetadata((prev) => !prev);
    }
  };

  if (!building || !building.model) return null;

  return (
    <CollapsibleForm
      enabled={enabled}
      className={clsx(classes.container, className)}
      collapsedClassName={classes.collapsed}
      expandedClassName={classes.expanded}
      collapsed={{
        buttonText: "⚙️",
        title: "Нажмите для редактирования модели",
      }}
      closeTitle="Скрыть форму редактирования модели"
      onToggled={onToggled}
    >
      <div className={classes.editHeader}>
        <h3 className={classes.title}>Редактировать модель</h3>
        <p className={classes.subtitle}>Измените параметры 3D модели здания</p>
      </div>

      <div className={classes.editForm} onClick={toggleMetadata}>
        <div className={classes.formGroup}>
          <label className={classes.formLabel} htmlFor="address-input">
            Адрес здания
          </label>
          <input
            id="address-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="например, Чкалова, 3"
            className={classes.formInput}
            disabled={true} // Адрес только для чтения
            readOnly
          />
          <p className={classes.hintText}>
            Адрес можно изменить в форме редактирования полигона
          </p>
        </div>

        <div className={classes.formGroup}>
          <label className={classes.formLabel} htmlFor="rotation-input">
            Поворот модели (градусы)
          </label>
          <input
            id="rotation-input"
            type="number"
            value={rotation}
            onChange={(e) => setRotation(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="0"
            className={classes.formInput}
            disabled={isSaving}
            min="0"
            max="360"
            step="1"
          />
          <p className={classes.hintText}>
            Вращение вокруг вертикальной оси (Y)
          </p>
        </div>

        <div className={classes.formGroup}>
          <label className={classes.formLabel} htmlFor="scale-input">
            Масштаб модели
          </label>
          <input
            id="scale-input"
            type="number"
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="1.0"
            className={classes.formInput}
            disabled={isSaving}
            min="0.1"
            step="0.1"
          />
          <p className={classes.hintText}>
            1.0 = оригинальный размер, 0.5 = в два раза меньше
          </p>
        </div>

        <div className={classes.formGroup}>
          <label className={classes.formLabel} htmlFor="ground-level-input">
            Уровень над землей
          </label>
          <input
            id="ground-level-input"
            type="number"
            value={groundLevel}
            onChange={(e) => setGroundLevel(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="0"
            className={classes.formInput}
            disabled={isSaving}
            step="0.1"
          />
          <p className={classes.hintText}>
            Высота основания модели над уровнем земли (в метрах)
          </p>
        </div>

        {showMetadata && (
          <>
            <div className={classes.buttonGroup}>
              <textarea ref={metadataRef}>{JSON.stringify(metadata)}</textarea>
            </div>
            <button onClick={importMetadata}>Использовать метаданные</button>
          </>
        )}

        <div className={classes.buttonGroup}>
          {(rotation || scale || groundLevel) && (
            <button
              onClick={clearForm}
              className={classes.clearButton}
              disabled={isSaving || isDeleting}
            >
              Сбросить изменения
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || isDeleting || !isFormValid()}
            className={classes.saveButton}
          >
            {isSaving ? "Сохранение..." : "Сохранить изменения"}
          </button>

          <button
            onClick={handleDelete}
            disabled={isSaving || isDeleting}
            className={classes.deleteButton}
          >
            {isDeleting ? "Удаление..." : "Удалить модель"}
          </button>
        </div>
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
            Измените параметры модели и нажмите "Сохранить изменения".
            <br />
            Кнопка "Удалить модель" помечает модель для удаления.
          </span>
        </div>
      )}
    </CollapsibleForm>
  );
};
