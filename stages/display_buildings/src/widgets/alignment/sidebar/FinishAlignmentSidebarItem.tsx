import { FinishAlignment } from "@components/ui/alignment/FinishAlignment";
import { SideBarItem } from "@kit/sidebar/item/SideBarItem";
import { FaRegSave } from "react-icons/fa";

export const FinishAlignmentSidebarItem = () => {
  return (
    <SideBarItem
      icon={FaRegSave}
      label="Сохранить выравнивание"
      form={FinishAlignment}
    />
  );
};
