import { useEffect, type ReactNode } from "react";
import classes from "./CenteredForm.module.css";
import { KeyboardEvent } from "react";

interface CenteredFormProps {
  enabled: boolean;
  dismissable?: boolean;
  children: ReactNode;
  closeTitle?: string;
  onClose: () => void;
}

const Footer = ({ dismissable }: { dismissable: boolean }) => {
  return (
    <div className={classes.footer}>
      <div>Нажмите ×{dismissable ? " или Escape" : ""} чтобы закрыть</div>
    </div>
  );
};

export function CenteredForm({
  enabled,
  children,
  closeTitle = "Закрыть форму",
  dismissable = false,
  onClose,
}: CenteredFormProps) {
  if (!enabled) return null;

  const handleEscapeOrBackdropClick = () => {
    if (dismissable) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (dismissable) {
        if (e.key === "Escape") {
          handleEscapeOrBackdropClick();
        }
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div className={classes.overlay} role="dialog" aria-modal="true">
      <div
        className={classes.backdrop}
        onClick={handleEscapeOrBackdropClick}
        aria-hidden="true"
      />
      <div className={classes.panel}>
        <button
          onClick={onClose}
          className={classes.closeButton}
          title={closeTitle}
          aria-label={closeTitle}
        >
          ×
        </button>
        {children}
        <Footer dismissable={dismissable} />
      </div>
    </div>
  );
}
