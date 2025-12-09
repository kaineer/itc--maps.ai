import classes from "./BuildingSelection.module.css";
import { MouseEvent } from "react";
import { EnabledProps } from "../shared/types";
import { CollapsibleForm } from "./CollapsibleForm";
import { FileUploadButton } from "../shared/ui/FileUploadButton";
import { alignmentSlice } from "../../store/slices/alignmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { Building } from "../../types/types";
import { modelUploadSlice } from "../../store/slices/modelUploadSlice";

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
  const { getSelectedPolygons } = alignmentSlice.selectors;
  const selectedPolygons = useSelector(getSelectedPolygons);
  const dispatch = useDispatch();
  const { setFileId } = modelUploadSlice.actions;
  const { getFileId } = modelUploadSlice.selectors;

  const loadedFileId = useSelector(getFileId);

  const handleUploadSuccess = ({ fileId }) => {
    console.log(`Файл сохранен с ID: ${fileId}`);
    dispatch(setFileId(fileId));
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
      {loadedFileId ? (
        <span>Файл модели загружен</span>
      ) : (
        <FileUploadButton allowedTypes={[""]} onSuccess={handleUploadSuccess} />
      )}
    </CollapsibleForm>
  );
};
