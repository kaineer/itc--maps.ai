import { SideBarItem } from "@features/app-chrome";
import { PiUserList } from "react-icons/pi";

export const UserListSidebarItem = () => {
  return (
    <SideBarItem icon={PiUserList} label="Список пользователей" url="/users" />
  );
};
