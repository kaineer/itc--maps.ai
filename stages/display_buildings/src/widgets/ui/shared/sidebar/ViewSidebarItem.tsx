import { buildingsSlice } from "@slices/buildingsSlice";
import { SideBarItem } from "@widgets/sidebar/item/SideBarItem";
import { FaStreetView } from "react-icons/fa6";
import { useSelector } from "react-redux";

export const ViewSidebarItem = () => {
  const { getLastLoadedPosition } = buildingsSlice.selectors;
  const lastLoadedPosition = useSelector(getLastLoadedPosition);
  const [x, _, z] = lastLoadedPosition;
  const url = x === 0 && z === 0 ? "/view" : "/view#x=" + x + "&z=" + z;

  return <SideBarItem icon={FaStreetView} label="Режим просмотра" url={url} />;
};
