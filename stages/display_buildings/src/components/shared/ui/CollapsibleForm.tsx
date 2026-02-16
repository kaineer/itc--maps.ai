import classes from "./CollapsibleForm.module.css"
import { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";

interface Props {
  enabled?: boolean;
  children: ReactNode;
  className: string;
  onToggled: (value: boolean) => void;
  collapsedClassName: string;
  expandedClassName: string;
  closeTitle: string;
  collapsed: {
    buttonText: string;
    title: string;
  };
  isCollapsed?: boolean;
}

interface CloseButtonProps {
  title: string;
  onClick: () => void;
}

const CloseButton = ({ onClick, title }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={classes.closeButton}
      title={ title }
    >
      ×
    </button>
  );
}

const FooterNote = () => {
  return (
    <div className={classes.footer}>
      <div>Нажмите × чтобы скрыть</div>
    </div>
  );
}

export const CollapsibleForm = ({
  enabled = true,
  className,
  children,
  isCollapsed = true,
  onToggled,
  closeTitle = "",
  collapsedClassName,
  expandedClassName,
  collapsed: {
    buttonText,
    title,
  }
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(!isCollapsed);

  const handleExpand = () => {
    setIsExpanded(true);
  }

  const handleClose = () => {
    setIsExpanded(false);
  }

  useEffect(() => {
    onToggled(isExpanded);
  }, [isExpanded]);

  if (!enabled) return null;

  if (!isExpanded) {
    return (
      <div
        className={clsx(className, collapsedClassName)}
        onClick={handleExpand}
        title={title}
      >
        <button className={classes.collapsedButton}>{buttonText}</button>
      </div>
    );
  }

  return (
    <div className={clsx(className, expandedClassName)}>
      <div className={classes.panel}>
        <CloseButton onClick={handleClose} title={closeTitle} />
        { children }
        <FooterNote />
      </div>
    </div>
  );
}
