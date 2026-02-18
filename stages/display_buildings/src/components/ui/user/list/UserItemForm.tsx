import classes from "./UserItemForm.module.css";
import { User } from "@.types/auth-types";
import { Button } from "@components/kit/Button";

interface Props {
  user: User;
}

export const UserItemForm = ({ user }: Props) => {
  // * label: name
  // * label: role
  // * button: remove
  // * button: change
  //
  const { id, login, role } = user;

  const handleRoleChange =
    (newRole: string) => (e: MouseEvent<HTMLButtonElement>) => {
      console.log({
        id,
        login,
        role: newRole,
      });
    };

  const variation = (active: boolean) =>
    active ? "210x56 green" : "210x56 gray pointer";

  return (
    <div className={classes.container}>
      <h1 className={classes.header}>{login}</h1>
      <div className={classes.roles}>
        <h1 className={classes.sectionHeader}>Роль</h1>
        <div className={classes.roleButtons}>
          <Button
            key="admin"
            variation={variation(role === "Admin")}
            onClick={handleRoleChange("Admin")}
          >
            Администратор
          </Button>
          <Button
            key="creator"
            variation={variation(role === "Creator")}
            onClick={handleRoleChange("Creator")}
          >
            Создатель
          </Button>
          <Button
            key="user"
            variation={variation(role === "User")}
            onClick={handleRoleChange("User")}
          >
            Пользователь
          </Button>
        </div>
      </div>
      <div className={classes.removePanel}>
        <Button variation="210x56 red" onClick={() => null}>
          Удалить
        </Button>
      </div>
    </div>
  );
};
