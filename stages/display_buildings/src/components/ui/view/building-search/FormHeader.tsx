import classes from "./FormHeader.module.css";

export const FormHeader = () => {
  return (
    <div className={classes.searchHeader}>
      <h3 className={classes.title}>Поиск зданий</h3>
      <p className={classes.subtitle}>
        Введите адрес в формате: "Улица, Номер дома"
        <br />
        Поддерживаются: 12А, 12-А, 12/1, 12 корп 1 и т.д.
        <br />
        Примеры: "Чкалова, 3", "ул Чкалова 3", "Чкалова 3"
      </p>
    </div>
  );
};
