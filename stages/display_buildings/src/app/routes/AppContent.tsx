import { useAuthentication } from "@entities/session";
import { UnauthorizedRouter } from "./UnauthorizedRouter";
import { AuthorizedRouter } from "./AuthorizedRouter";
import { useEffect } from "react";
import { uiSlice } from "@features/app-chrome";
import { useDispatch } from "react-redux";

export const AppContent = () => {
  const { isAuthenticated } = useAuthentication();
  const { toggleSidebarHidden } = uiSlice.actions;
  const dispatch = useDispatch();

  const handleSemicolon = (e: KeyboardEvent): void => {
    if (e.code === "Semicolon") {
      dispatch(toggleSidebarHidden());
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleSemicolon);
    return () => document.removeEventListener("keydown", handleSemicolon);
  }, []);

  return isAuthenticated ? <AuthorizedRouter /> : <UnauthorizedRouter />;
};
