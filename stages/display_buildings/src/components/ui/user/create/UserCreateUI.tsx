import { CreateUser } from "@.types/user-request-types";
import classes from "./UserCreateUI.module.css";
import { UserForm } from "./UserForm";
import { usePostUserMutation } from "@store/api/UsersApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Logout } from "@components/ui/view/Logout";
import { ButtonsGroup } from "@components/kit/ButtonsGroup";
import { UserList } from "@components/ui/view/UserList";
import { ViewButton } from "@components/ui/view/ViewButton";

const UserCreateButtons = () => {
  return (
    <ButtonsGroup>
      <ViewButton />
      <UserList />
      <Logout />
    </ButtonsGroup>
  );
};

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
      <UserCreateButtons />
      <UserForm onCreateUser={handleCreateUser} />
    </div>
  );
};
