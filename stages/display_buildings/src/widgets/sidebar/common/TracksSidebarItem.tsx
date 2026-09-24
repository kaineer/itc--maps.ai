import { SideBarItem } from "@features/app-chrome";
import { FaListUl } from "react-icons/fa";

export const TracksSidebarItem = () => {
  return (
    <SideBarItem
      icon={FaListUl}
      label="Редактирование экскурсий"
      url="/tracks"
    />
  );
};
