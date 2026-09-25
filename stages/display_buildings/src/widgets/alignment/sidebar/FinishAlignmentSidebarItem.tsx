import { FinishAlignment } from "@widgets/alignment/forms/save/FinishAlignment";
import { SideBarItem } from "@features/app-chrome";
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
