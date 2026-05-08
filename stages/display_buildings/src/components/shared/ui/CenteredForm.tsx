import { type ReactNode } from "react";
import classes from "./CenteredForm.module.css";

interface CenteredFormProps {
  enabled: boolean;
  children: ReactNode;
  closeTitle?: string;
  onClose: () => void;
}

const Footer = () => {
  return (
    <div className={classes.footer}>
      <div>Нажмите × или Escape чтобы закрыть</div>
    </div>
  );
};

export function CenteredForm({
  enabled,
  children,
  closeTitle = "Закрыть форму",
  onClose,
}: CenteredFormProps) {
  if (!enabled) return null;

  return (
    <div className={classes.overlay} role="dialog" aria-modal="true">
      <div className={classes.backdrop} onClick={onClose} aria-hidden="true" />
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
        <Footer />
      </div>
    </div>
  );
}
