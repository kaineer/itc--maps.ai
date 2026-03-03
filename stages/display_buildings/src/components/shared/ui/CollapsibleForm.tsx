import classes from "./CollapsibleForm.module.css";
import { ReactNode, useState } from "react";
import clsx from "clsx";
import { NavigationButton } from "@components/kit/NavigationButton";

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
}

interface CloseButtonProps {
  title: string;
  onClick: () => void;
}

const CloseButton = ({ onClick, title }: CloseButtonProps) => {
  return (
    <button onClick={onClick} className={classes.closeButton} title={title}>
      ×
    </button>
  );
};

const FooterNote = () => {
  return (
    <div className={classes.footer}>
      <div>Нажмите × чтобы скрыть</div>
    </div>
  );
};

export const CollapsibleForm = ({
  enabled = true,
  className,
  children,
  onToggled,
  closeTitle = "",
  collapsedClassName,
  expandedClassName,
  collapsed: { buttonText, title },
}: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleExpand = () => {
    setIsExpanded(true);
    onToggled(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    onToggled(false);
  };

  if (!enabled) return null;

  if (!isExpanded) {
    return (
      <NavigationButton onClick={handleExpand} title={title}>
        {buttonText}
      </NavigationButton>
    );
  }

  return (
    <div className={clsx(className, expandedClassName)}>
      <div className={classes.panel}>
        <CloseButton onClick={handleClose} title={closeTitle} />
        {children}
        <FooterNote />
      </div>
    </div>
  );
};
