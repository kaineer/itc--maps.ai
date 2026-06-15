import classes from "./UserCreateUI.module.css";
import { useNavigate } from "react-router";

import { CreateUser } from "@.types/user-request-types";

import { useNotification } from "@hooks/useNotification";
import { usePostUserMutation } from "@entities/users/model/users.api";
import { NewUserSideBar } from "@widgets/users/sidebar/NewUserSideBar";
import { UserForm } from "@widgets/users/create/UserForm";

export const UserCreateUI = () => {
  const [createUser] = usePostUserMutation();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const handleCreateUser = async (user: Partial<CreateUser>) => {
    try {
      await createUser(user).unwrap();
      notify("Создан новый пользователь " + user.login);
      navigate("/users");
    } catch (err) {
      notify("Не удалось создать пользователя", err || new Error());
    }
  };

  return (
    <div className={classes.container}>
      <NewUserSideBar />
      <UserForm onCreateUser={handleCreateUser} />
    </div>
  );
};
