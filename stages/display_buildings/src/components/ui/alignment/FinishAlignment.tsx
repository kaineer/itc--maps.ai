import classes from "./FinishAlignment.module.css";
import { useSelector } from "react-redux";
import { alignmentSlice } from "@slices/alignmentSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { CreateModel } from "@.types/buildings-types";
import { useNotification } from "@hooks/useNotification";
import { useCreateModelPositionMutation } from "@entities/models/model/models.api";
import { CenteredForm } from "@kit/centered-form/CenteredForm";
import { useSelectedPolygons } from "@hooks/alignment/useAlignmentSlice";

interface Props {
  enabled: boolean;
  onClose?: () => void;
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
  onClose = () => null,
}: Props) => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { getModelUUID, getModelTransform } = alignmentSlice.selectors;
  const [createModel] = useCreateModelPositionMutation();
  const modelUUID = useSelector(getModelUUID);
  const modelTransform = useSelector(getModelTransform);

  const { selectedPolygons } = useSelectedPolygons();
  /**
   * Handle save alignment button click
   * Saves current alignment to backend via PATCH /models/:modelId
   */
  const handleSaveAlignment = async () => {
    if (!modelUUID) {
      return toast.error("Cannot save alignment: no model selected");
    }
    if (selectedPolygons.length === 0) {
      return toast.error("Cannot save alignment: no polygons selected");
    }
    const pa = selectedPolygons.find((p) => p.address);
    let address: string | null = null;
    if (pa) {
      address = pa.address;
    }
    try {
      const { position, rotation, scale } = modelTransform;
      const transformData: CreateModel = {
        id: modelUUID,
        position,
        rotation: [0, rotation, 0],
        scale,
        polygons: selectedPolygons.map((p) => p.id),
        address: address || void 0,
      };
      await createModel(transformData).unwrap();
      navigate("/view");
    } catch (err) {
      notify("Не удалось сохранить выравнивание", err);
    }
  };
  /**
   * Handle return to view mode button click
   * Switches UI mode from alignment back to view
   */
  const handleReturnToView = () => {
    navigate("/view");
  };
  return (
    <CenteredForm enabled={enabled} onClose={onClose}>
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
    </CenteredForm>
  );
};
