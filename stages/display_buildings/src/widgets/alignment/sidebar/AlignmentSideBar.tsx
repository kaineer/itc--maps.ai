import { HoveringSideBar } from "@kit/sidebar/HoveringSideBar";
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
