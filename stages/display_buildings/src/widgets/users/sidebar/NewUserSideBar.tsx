import { HoveringSideBar } from "@features/app-chrome";
import { AuthSidebarItems } from "@widgets/sidebar/common/AuthSidebarItems";
import { UserListSidebarItem } from "@widgets/sidebar/common/UserlistSidebarItem";
import { ViewSidebarItem } from "@widgets/sidebar/common/ViewSidebarItem";

export const NewUserSideBar = () => {
  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <ViewSidebarItem />
      <UserListSidebarItem />
    </HoveringSideBar>
  );
};
