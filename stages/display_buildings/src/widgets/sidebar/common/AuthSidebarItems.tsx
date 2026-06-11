import { useAuthentication } from "@hooks/useAuthentication";
import { SideBarItem } from "@kit/sidebar/item/SideBarItem";
import { IoIosLogOut } from "react-icons/io";
import { IoLogInOutline } from "react-icons/io5";

export const AuthSidebarItems = () => {
  const { logout, isAuthenticated } = useAuthentication();

  return (
    <>
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
    </>
  );
};
