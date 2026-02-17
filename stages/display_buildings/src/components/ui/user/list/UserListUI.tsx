import classes from "./UserListUI.module.css";
import { User } from "@.types/auth-types";
import { UserItemForm } from "./UserItemForm";
import { useGetUserListQuery } from "@store/api/UsersApi";

export const UserListUI = () => {
  const { data, isLoading } = useGetUserListQuery();

  if (!data || isLoading) return null;

  return (
    <div className={classes.container}>
      {data.map((user: User) => (
        <UserItemForm user={user} />
      ))}
    </div>
  );
};
