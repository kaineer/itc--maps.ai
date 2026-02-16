import classes from "./BuildingSelection.module.css";
import {
  alignmentSlice,
  prepareInitialTransform,
} from "@slices/alignmentSlice";
import { modelUploadSlice } from "@slices/modelUploadSlice";

import { useDispatch, useSelector } from "react-redux";
import { EnabledProps } from "@.types/types";
import { AppDispatch } from "@store/index";
import { CollapsibleForm } from "@components/shared/ui/CollapsibleForm";
import { SelectedBuildings } from "./SelectedBuildings";
import { StartAlignmentButton } from "@components/shared/ui/StartAlignmentButton";
import { FileUploadButton } from "@components/shared/ui/FileUploadButton";
import { useNavigate } from "react-router";

interface Props extends EnabledProps {
  className?: string;
  onToggled: (value: boolean) => void;
}

export const BuildingSelection = ({ enabled, onToggled }: Props) => {
  const { getSelectedPolygons, getModelUUID, getCanStartAlignment } =
    alignmentSlice.selectors;
  const { selectModelForAlignment } = alignmentSlice.actions;
  const selectedPolygons = useSelector(getSelectedPolygons);
  const dispatch = useDispatch<AppDispatch>();
  const { getLoading } = modelUploadSlice.selectors;
  const navigate = useNavigate();

  const loadedModel = useSelector(getModelUUID);
  const fileIsLoading = useSelector(getLoading);
  const canStartAlignment = useSelector(getCanStartAlignment);

  const buttonText = fileIsLoading ? "Загружаю..." : "Выберите модель";

  const handleUploadSuccess = ({ model: modelId }: { model: string }) => {
    dispatch(selectModelForAlignment(modelId));
  };

  const handleStartClick = () => {
    if (loadedModel) {
      dispatch(
        prepareInitialTransform({
          modelUUID: loadedModel,
          polygons: selectedPolygons,
        }),
      );
      // FIXME if wtf
      // dispatch(selectAlignmentMode());
      navigate("/align");
    }
  };

  return (
    <CollapsibleForm
      enabled={enabled}
      className={classes.container}
      collapsedClassName={classes.collapsed}
      expandedClassName={classes.expanded}
      collapsed={{ buttonText: "🪧", title: "Нажмите для просмотра списка" }}
      closeTitle="Скрыть список"
      onToggled={onToggled}
    >
      <div className={classes.selectHeader}>
        <h3 className={classes.title}>Настройка модели</h3>
      </div>
      <SelectedBuildings buildings={selectedPolygons} />
      {loadedModel ? (
        <span>Файл модели загружен</span>
      ) : (
        <FileUploadButton
          buttonText={buttonText}
          allowedTypes={[""]}
          onSuccess={handleUploadSuccess}
        />
      )}
      {canStartAlignment && <StartAlignmentButton onClick={handleStartClick} />}
    </CollapsibleForm>
  );
};
