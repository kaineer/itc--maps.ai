import { HoveringSideBar } from "@widgets/sidebar/HoveringSideBar";
import { AuthSidebarItems } from "@widgets/ui/shared/sidebar/AuthSidebarItems";
import { FinishAlignmentSidebarItem } from "./FinishAlignmentSidebarItem";

export const AlignmentSideBar = () => {
  return (
    <HoveringSideBar>
      <AuthSidebarItems />
      <FinishAlignmentSidebarItem />
    </HoveringSideBar>
  );
};
