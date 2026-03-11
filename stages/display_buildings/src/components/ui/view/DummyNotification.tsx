import { PropsWithChildren } from "react";
import classes from "./DummyNotification.module.css";

interface Props extends PropsWithChildren {
  enabled?: boolean;
  onClose?: () => void;
}

export const DummyNotification = ({
  enabled = true,
  children,
  onClose = () => null,
}: Props) => {
  if (!enabled) {
    return null;
  }

  return (
    <div className={classes.notification}>
      <button
        className={classes.closeButton}
        onClick={onClose}
        aria-label="Закрыть"
      >
        ×
      </button>
      <h1 className={classes.title}>Цифровой колледж</h1>

      <p className={classes.subtitle}>
        <em>
          Подготовка ИТ-специалистов, соответствующих новым вызовам и
          конкурентных среди технологических платформ будущего, требует
          передовых подходов и форматов образовательного процесса
        </em>
      </p>

      <div className={classes.content}>
        <p>
          В нашем образовательном учреждении мы сочетаем отраслевые технологии и
          стандарты с опытом преподавательской деятельности. Изучение процесса
          подготовки ИТ-специалистов в различных странах, позволило нам
          адаптировать наиболее успешные методики.
        </p>

        <p>
          При этом, в наших студентах мы развиваем не только профессиональные
          компетенции, но и целеустремленность, ответственность, расширяем их
          кругозор и социальные навыки.
        </p>
      </div>

      {children && <div className={classes.children}>{children}</div>}
    </div>
  );
};
