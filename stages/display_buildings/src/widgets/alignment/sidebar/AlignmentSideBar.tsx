import { HoveringSideBar } from "@features/app-chrome";
import { AuthSidebarItems } from "@widgets/sidebar/common/AuthSidebarItems";
import { FinishAlignmentSidebarItem } from "./FinishAlignmentSidebarItem";

export const AlignmentSideBar = () => {
  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <FinishAlignmentSidebarItem />
    </HoveringSideBar>
  );
};
