import classes from "./UserListUI.module.css";
import { User } from "@.types/auth-types";
import { UserItemForm } from "./UserItemForm";
import { useGetUserListQuery } from "@store/api/UsersApi";
import { ButtonsGroup } from "@components/kit/ButtonsGroup";
import { ViewButton } from "@components/ui/view/ViewButton";
import { Logout } from "@components/ui/view/Logout";
import { AddUser } from "@components/ui/view/AddUser";
import { UsersSideBar } from "@widgets/ui/users/sidebar/UsersSideBar";

const UserListButtons = () => {
  return (
    <ButtonsGroup>
      <AddUser />
      <ViewButton />
      <Logout />
    </ButtonsGroup>
  );
};

export const UserListUI = () => {
  const { data, isLoading } = useGetUserListQuery();

  if (!data || isLoading) return null;

  return (
    <div className={classes.container}>
      <UsersSideBar />
      {data.map((user: User) => (
        <UserItemForm user={user} />
      ))}
    </div>
  );
};
