import classes from "./UserCreateUI.module.css";
import { CreateUser } from "@.types/user-request-types";
import { UserForm } from "./UserForm";
import { useNavigate } from "react-router";
import { useNotification } from "@hooks/useNotification";
import { usePostUserMutation } from "@entities/users/model/users.api";
import { NewUserSideBar } from "@widgets/users/sidebar/NewUserSideBar";

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
