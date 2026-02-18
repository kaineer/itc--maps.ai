import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

import { authFromLocalStorage } from "@slices/authenticationSlice";
import { AppDispatch } from "@store/index";
import { useAuthentication } from "@hooks/useAuthentication";

interface Props {
  children: ReactNode;
}

export const AuthInitialization = ({ children }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { starting } = useAuthentication();

  useEffect(() => {
    dispatch(authFromLocalStorage());
  }, [dispatch]);

  if (starting) return null;

  return children;
};
