import { useDispatch } from "react-redux";
import { uiSlice } from "../../store/uiSlice";
import classes from "./IntroUI.module.css";

export const IntroUI = () => {
  const dispatch = useDispatch();
  const { selectViewMode } = uiSlice.actions;

  const handleButtonClick = () => {
    dispatch(selectViewMode());
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.header}>Внимание</div>
        <div className={classes.text}>
          Все, что вы видите на этой странице -- начало проекта, который взлетит
          (но это не точно), на котором вы сможете, если приглядитесь, увидеть
          карту города Екатеринбурга, с высоты 1.8 метра и за это вам ничего не
          будет.
        </div>
        <div className={classes.text}>
          Бэкенд пока не прикручен, загружена только маленькая часть города,
          поэтому подгрузка зданий при перемещении не работает.
        </div>
        <div className={classes.text}>
          Включите ваши телевизоры на следующей неделе, возможно, мы покажем вам
          что-нибудь новенькое. Или нет.
        </div>
        <button className={classes.button} onClick={handleButtonClick}>
          Ясно-понятно
        </button>
      </div>
    </div>
  );
};
