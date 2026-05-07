import { SideBarItem } from "@widgets/sidebar/item/SideBarItem";
import { PiUserList } from "react-icons/pi";

export const UserListSidebarItem = () => {
  return (
    <SideBarItem icon={PiUserList} label="Список пользователей" url="/users" />
  );
};
