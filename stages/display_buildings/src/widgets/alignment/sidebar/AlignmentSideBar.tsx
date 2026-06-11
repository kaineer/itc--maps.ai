import { HoveringSideBar } from "@kit/sidebar/HoveringSideBar";
import { FinishAlignmentSidebarItem } from "./FinishAlignmentSidebarItem";
import { AuthSidebarItems } from "@widgets/sidebar/common/AuthSidebarItems";

export const AlignmentSideBar = () => {
  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <FinishAlignmentSidebarItem />
    </HoveringSideBar>
  );
};
