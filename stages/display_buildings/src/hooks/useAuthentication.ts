import { useContext } from "react";
import { AuthContext, AuthContextType } from "@contexts/AuthContext";

export const useAuthentication = (): AuthContextType | undefined => {
  const context = useContext(AuthContext);

  if (typeof context === "undefined") {
    throw new Error("useAuthentication should be used inside AuthProvider");
  }

  return context;
};
