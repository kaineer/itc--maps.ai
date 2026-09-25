import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

import { authFromLocalStorage } from "@entities/session";
import { AppDispatch } from "@store/index";
import { useAuthentication } from "@entities/session";

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
