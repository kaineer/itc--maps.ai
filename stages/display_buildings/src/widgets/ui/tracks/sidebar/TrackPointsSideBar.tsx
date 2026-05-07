import { HoveringSideBar } from "@widgets/sidebar/HoveringSideBar";
import { AuthSidebarItems } from "@widgets/ui/shared/sidebar/AuthSidebarItems";
import { TracksSidebarItem } from "@widgets/ui/shared/sidebar/TracksSidebarItem";
import { UserListSidebarItem } from "@widgets/ui/shared/sidebar/UserlistSidebarItem";
import { ViewSidebarItem } from "@widgets/ui/shared/sidebar/ViewSidebarItem";

export const TrackPointsSideBar = () => {
  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <TracksSidebarItem />
      <UserListSidebarItem />
      <ViewSidebarItem />
    </HoveringSideBar>
  );
};
