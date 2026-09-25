import { HoveringSideBar, SideBarItem } from "@features/app-chrome";
import { AuthSidebarItems } from "@widgets/sidebar/common/AuthSidebarItems";
import { ViewSidebarItem } from "@widgets/sidebar/common/ViewSidebarItem";
import { RiUserAddLine } from "react-icons/ri";

export const UsersSideBar = () => {
  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <ViewSidebarItem />
      <SideBarItem
        icon={RiUserAddLine}
        url="/users/create"
        label="Добавить пользователя"
      />
    </HoveringSideBar>
  );
};
