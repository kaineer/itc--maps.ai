import classes from './BuildingSelection.module.css'
import clsx from 'clsx';
import { useState, MouseEvent } from 'react';

export const BuildingSelection = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleExpand = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsExpanded(true);
  }

  return (
    <div
      className={clsx(classes.container, {[classes.collapsed]: !isExpanded})}
      onClick={handleExpand}
    >
      <button className={classes.collapsedButton}>🪧</button>
    </div>
  );
}
