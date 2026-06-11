import { HoveringSideBar } from "@kit/sidebar/HoveringSideBar";
import { AuthSidebarItems } from "@widgets/sidebar/common/AuthSidebarItems";
import { UserListSidebarItem } from "@widgets/sidebar/common/UserlistSidebarItem";
import { ViewSidebarItem } from "@widgets/sidebar/common/ViewSidebarItem";

export const TracksSideBar = () => {
  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <UserListSidebarItem />
      <ViewSidebarItem />
    </HoveringSideBar>
  );
};
