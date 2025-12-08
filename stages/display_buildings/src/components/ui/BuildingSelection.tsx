import classes from './BuildingSelection.module.css'
import clsx from 'clsx';
import { useState, MouseEvent } from 'react';
import { EnabledProps } from '../shared/types';
import { CollapsibleForm } from './CollapsibleForm';
import { FileUploadButton } from '../shared/ui/FileUploadButton';

interface Props extends EnabledProps {
  className?: string;
  onToggled: (value: boolean) => void;
}

export const BuildingSelection = ({ enabled, onToggled }: Props) => {
  return (
    <CollapsibleForm
      enabled={enabled}
      className={classes.container}
      collapsedClassName={classes.collapse}
      expandedClassName={classes.expanded}
      collapsed={{buttonText: "🪧", title: "Нажмите для просмотра списка"}}
      closeTitle="Скрыть список"
      onToggled={onToggled}
      >
      <div className={classes.selectHeader}>
        <h3 className={classes.title}>Настройка модели</h3>
      </div>
      <FileUploadButton />
    </CollapsibleForm>
  );
}
