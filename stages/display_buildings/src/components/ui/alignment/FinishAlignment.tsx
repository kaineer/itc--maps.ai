import { useDispatch } from "react-redux";
import classes from "./FinishAlignment.module.css";
import clsx from "clsx";
import { uiSlice } from "@slices/uiSlice";
import { saveAlignment } from "@slices/alignmentSlice";
import { type AppDispatch } from "@store/index";
import { CollapsibleForm } from "@components/shared/ui/CollapsibleForm";

interface Props {
  enabled?: boolean;
  className?: string;
  onToggled: (value: boolean) => void;
}

/**
 * FinishAlignment component for completing the alignment process.
 *
 * Features:
 * - "Сохранить выравнивание" button (placeholder for future save functionality)
 * - "Вернуться в режим просмотра" button (switches back to view mode)
 * - Uses CollapsibleForm as base component
 * - Integrates with Redux for UI mode switching
 */
export const FinishAlignment = ({
  enabled = true,
  className = "",
  onToggled,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectViewMode } = uiSlice.actions;

  /**
   * Handle save alignment button click
   * Saves current alignment to backend via PATCH /models/:modelId
   */
  const handleSaveAlignment = () => {
    dispatch(saveAlignment());
  };

  /**
   * Handle return to view mode button click
   * Switches UI mode from alignment back to view
   */
  const handleReturnToView = () => {
    dispatch(selectViewMode());
  };

  return (
    <CollapsibleForm
      enabled={enabled}
      className={clsx(classes.container, className)}
      collapsedClassName={classes.collapsed}
      expandedClassName={classes.expanded}
      collapsed={{ buttonText: "✅", title: "Завершить выравнивание" }}
      closeTitle="Скрыть панель завершения"
      onToggled={onToggled}
    >
      <div className={classes.header}>
        <h3 className={classes.title}>Завершение выравнивания</h3>
        <p className={classes.subtitle}>
          Завершите процесс выравнивания 3D модели с полигоном здания
        </p>
      </div>

      <div className={classes.buttonsContainer}>
        <button
          onClick={handleSaveAlignment}
          className={classes.saveButton}
          title="Сохранить текущее выравнивание в базу данных"
        >
          Сохранить выравнивание
        </button>

        <button
          onClick={handleReturnToView}
          className={classes.returnButton}
          title="Вернуться в режим просмотра без сохранения"
        >
          Вернуться в режим просмотра
        </button>
      </div>

      <div className={classes.infoSection}>
        <div className={classes.infoItem}>
          <span className={classes.infoIcon}>💾</span>
          <span className={classes.infoText}>
            <strong>Сохранить выравнивание</strong> - сохранит текущее положение
            модели относительно полигона в базу данных
          </span>
        </div>

        <div className={classes.infoItem}>
          <span className={classes.infoIcon}>👁️</span>
          <span className={classes.infoText}>
            <strong>Вернуться в режим просмотра</strong> - переключит интерфейс
            обратно в режим просмотра без сохранения изменений
          </span>
        </div>
      </div>
    </CollapsibleForm>
  );
};
