import { HoveringSideBar } from "@widgets/sidebar/HoveringSideBar";
import { AuthSidebarItems } from "@widgets/ui/shared/sidebar/AuthSidebarItems";
import { UserListSidebarItem } from "@widgets/ui/shared/sidebar/UserlistSidebarItem";
import { ViewSidebarItem } from "@widgets/ui/shared/sidebar/ViewSidebarItem";

export const TracksSideBar = () => {
  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <UserListSidebarItem />
      <ViewSidebarItem />
    </HoveringSideBar>
  );
};
