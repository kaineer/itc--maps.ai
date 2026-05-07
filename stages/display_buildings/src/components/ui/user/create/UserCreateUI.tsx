import { CreateUser } from "@.types/user-request-types";
import classes from "./UserCreateUI.module.css";
import { UserForm } from "./UserForm";
import { usePostUserMutation } from "@store/api/UsersApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { NewUserSideBar } from "@widgets/ui/users/sidebar/NewUserSideBar";

export const UserCreateUI = () => {
  const [createUser] = usePostUserMutation();
  const navigate = useNavigate();

  const handleCreateUser = async (user: Partial<CreateUser>) => {
    try {
      await createUser(user);
      toast.info("Создан новый пользователь " + user.login);
      navigate("/users");
    } catch (err) {
      toast.error("Не удалось создать пользователя", {
        description: String(err),
      });
    }
  };

  return (
    <div className={classes.container}>
      <NewUserSideBar />
      <UserForm onCreateUser={handleCreateUser} />
    </div>
  );
};
