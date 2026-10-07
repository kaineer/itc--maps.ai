import classes from "./UserListUI.module.css";
import type { User } from "@entities/users";
import { UsersSideBar } from "@widgets/users/sidebar/UsersSideBar";
import { useGetUserListQuery } from "@entities/users";
import { UserItemForm } from "@widgets/users/list/UserItemForm";

export const UserListUI = () => {
  const { data: users, isLoading } = useGetUserListQuery();

  if (!users || isLoading) return null;

  return (
    <div className={classes.container}>
      <UsersSideBar />
      {users.map((user: User) => (
        <UserItemForm user={user} />
      ))}
    </div>
  );
};
