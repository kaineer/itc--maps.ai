import { HoveringSideBar } from "@widgets/sidebar/HoveringSideBar";
import { SideBarItem } from "@widgets/sidebar/item/SideBarItem";
import { AuthSidebarItems } from "@widgets/ui/shared/sidebar/AuthSidebarItems";
import { ViewSidebarItem } from "@widgets/ui/shared/sidebar/ViewSidebarItem";
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
