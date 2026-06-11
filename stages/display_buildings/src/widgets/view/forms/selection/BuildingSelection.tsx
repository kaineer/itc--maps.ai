import classes from "./BuildingSelection.module.css";
import { AppDispatch } from "@store/index";
import {
  alignmentSlice,
  prepareInitialTransform,
} from "@slices/alignmentSlice";
import { modelUploadSlice } from "@slices/modelUploadSlice";
import { FileUploadButton } from "@kit/file-upload/FileUploadButton";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { SelectedBuildings } from "./buildings/SelectedBuildings";
import { StartAlignmentButton } from "@components/shared/ui/StartAlignmentButton";
import { CenteredForm } from "@kit/centered-form/CenteredForm";

interface Props {
  enabled: boolean;
  onClose?: () => void;
}

export const BuildingSelection = ({ enabled, onClose = () => null }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getSelectedPolygons, getModelUUID, getCanStartAlignment } =
    alignmentSlice.selectors;
  const { selectModelForAlignment } = alignmentSlice.actions;
  const { getLoading } = modelUploadSlice.selectors;
  const navigate = useNavigate();

  const selectedPolygons = useSelector(getSelectedPolygons);
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
    <CenteredForm enabled={enabled} dismissable={true} onClose={onClose}>
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
    </CenteredForm>
  );
};
