import { viewSlice } from "@slices/viewSlice";
import { HoveringSideBar } from "@widgets/sidebar/HoveringSideBar";
import { SideBarItem } from "@widgets/sidebar/item/SideBarItem";
import { IoLogInOutline } from "react-icons/io5";
import { GoMoveToTop } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useAuthentication } from "@hooks/useAuthentication";

export const ViewSidebar = () => {
  const { isAuthenticated, logout } = useAuthentication();

  const dispatch = useDispatch();
  const { getMinimapEnabled } = viewSlice.selectors;
  const minimapEnabled = useSelector(getMinimapEnabled);
  const { enableMinimap, disableMinimap } = viewSlice.actions;

  const handleToggleMinimap = () => {
    if (minimapEnabled) {
      dispatch(disableMinimap());
    } else {
      dispatch(enableMinimap());
    }
  };

  return (
    <HoveringSideBar>
      <SideBarItem
        icon={IoLogInOutline}
        url="/login"
        label="Войти"
        displayWhen={() => !isAuthenticated}
      />
      <SideBarItem
        icon={IoIosLogOut}
        label="Выйти"
        onClick={logout}
        displayWhen={() => isAuthenticated}
      />
      <SideBarItem
        icon={GoMoveToTop}
        label={minimapEnabled ? "Выключить миникарту" : "Включить миникарту"}
        onClick={handleToggleMinimap}
      />
    </HoveringSideBar>
  );
};
