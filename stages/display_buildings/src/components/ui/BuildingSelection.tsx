import classes from "./BuildingSelection.module.css";
import { MouseEvent } from "react";
import { EnabledProps } from "../shared/types";
import { CollapsibleForm } from "./CollapsibleForm";
import { FileUploadButton } from "../shared/ui/FileUploadButton";
import { StartAlignmentButton } from "../shared/ui/StartAlignmentButton";
import {
  alignmentSlice,
  prepareInitialTransform,
} from "../../store/slices/alignmentSlice";
import { uiSlice } from "../../store/slices/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Building } from "../../types/types";
import {
  modelUploadSlice,
  setFileIdAndLoad,
} from "../../store/slices/modelUploadSlice";
import { AppDispatch } from "../../store";

interface Props extends EnabledProps {
  className?: string;
  onToggled: (value: boolean) => void;
}

interface SelectedBuildingsProps {
  buildings: Building[];
}

interface RemoveButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  description: string;
}

const RemoveButton = ({ onClick, description }: RemoveButtonProps) => (
  <button
    className={classes.removeButton}
    onClick={onClick}
    title="Удалить из списка"
    aria-label={description}
  >
    ×
  </button>
);

const SelectedBuildings = ({ buildings }: SelectedBuildingsProps) => {
  const selectedPolygons = buildings;
  const dispatch = useDispatch();
  const { removePolygonFromAlignment } = alignmentSlice.actions;

  const handleRemovePolygon = (
    building: Building,
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    dispatch(removePolygonFromAlignment(building));
  };

  return (
    <div className={classes.buildingList}>
      <div className={classes.listHeader}>
        <h4 className={classes.subtitle}>
          Выбранные здания:
          {selectedPolygons && selectedPolygons.length > 0 && (
            <span className={classes.countBadge}>
              {selectedPolygons.length}
            </span>
          )}
        </h4>
      </div>

      {selectedPolygons && selectedPolygons.length > 0 ? (
        <ul className={classes.list}>
          {selectedPolygons.map((building: Building, index: number) => (
            <li key={building.id || index} className={classes.listItem}>
              {/* Отображаем address если он есть, иначе id */}
              <span className={classes.buildingName}>
                {building.address ? building.address : building.id}
              </span>

              <RemoveButton
                onClick={(e) => handleRemovePolygon(building, e)}
                description={`Удалить ${building.address || building.id}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className={classes.emptyMessage}>Здания не выбраны</p>
      )}
    </div>
  );
};

export const BuildingSelection = ({ enabled, onToggled }: Props) => {
  const { getSelectedPolygons, getModelUUID, getCanStartAlignment } =
    alignmentSlice.selectors;
  const { selectModelForAlignment } = alignmentSlice.actions;
  const selectedPolygons = useSelector(getSelectedPolygons);
  const dispatch = useDispatch<AppDispatch>();
  const { getLoading } = modelUploadSlice.selectors;
  const { selectAlignmentMode } = uiSlice.actions;

  const loadedModel = useSelector(getModelUUID);
  const fileIsLoading = useSelector(getLoading);
  const canStartAlignment = useSelector(getCanStartAlignment);

  const buttonText = fileIsLoading ? "Загружаю..." : "Выберите модель";

  const handleUploadSuccess = ({ modelId }: { modelId: string }) => {
    dispatch(selectModelForAlignment(modelId));
  };

  const handleStartClick = () => {
    // TODO: save model metadata
    // TODO: dispatch selectAlignmentMode
    if (loadedModel) {
      dispatch(
        prepareInitialTransform({
          modelUUID: loadedModel,
          polygons: selectedPolygons,
        }),
      );
      dispatch(selectAlignmentMode());
    }
  };

  return (
    <CollapsibleForm
      enabled={enabled}
      className={classes.container}
      collapsedClassName={classes.collapse}
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
