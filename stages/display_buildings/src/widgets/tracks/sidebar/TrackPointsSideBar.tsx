import { HoveringSideBar } from "@kit/sidebar/HoveringSideBar";
import { AuthSidebarItems } from "@widgets/sidebar/common/AuthSidebarItems";
import { TracksSidebarItem } from "@widgets/sidebar/common/TracksSidebarItem";
import { UserListSidebarItem } from "@widgets/sidebar/common/UserlistSidebarItem";
import { ViewSidebarItem } from "@widgets/sidebar/common/ViewSidebarItem";

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
