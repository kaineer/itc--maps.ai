import classes from "./UserItemForm.module.css";
import { type MouseEvent } from "react";
import { User } from "@.types/auth-types";
import { Button } from "@components/kit/Button";
import { useAuthentication } from "@hooks/useAuthentication";
import { getRoleIndex } from "@utils/roles";
import { useNotification } from "@hooks/useNotification";
import {
  useDeleteUserMutation,
  usePutUserMutation,
} from "@entities/users/model/users.api";

interface Props {
  user: User;
}

export const UserItemForm = ({ user }: Props) => {
  const { id, login, role, name } = user;
  const { user: currentUser } = useAuthentication();
  const { notify, warn } = useNotification();

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = usePutUserMutation();
  const enabledRemove = login !== currentUser?.login;

  const handleRoleChange = (newRole: string) => () => {
    updateUser({
      id,
      role: getRoleIndex(newRole),
    });
  };

  const variation = (active: boolean) =>
    active ? "210x56 green" : "210x56 grey pointer";

  const handleRemoveClick = enabledRemove
    ? async () => {
        try {
          await deleteUser(id).unwrap();
          notify("Удален пользователь " + name);
        } catch (err) {
          notify("Не удалось удалить пользователя", err || new Error());
        }
      }
    : () => {
        warn("Харакири не наш путь");
      };

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
          <Button
            key="uploader"
            variation={variation(role === "Uploader")}
            onClick={handleRoleChange("Uploader")}
          >
            Загрузчик
          </Button>
        </div>
      </div>
      <div className={classes.removePanel}>
        <Button
          variation={enabledRemove ? "210x56 red" : "210x56 grey"}
          onClick={handleRemoveClick}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
};
