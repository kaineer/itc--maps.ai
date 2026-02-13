import {
  authenticationSlice,
  loginThunk,
  logoutThunk,
} from "@slices/authenticationSlice";
import { AppDispatch } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { AuthHookType, LoginCredentials } from "src/types/auth-types";

export const useAuthentication = (): AuthHookType => {
  const dispatch = useDispatch<AppDispatch>();

  const { getIsAuthenticated, getUser, getUserRole, getError } =
    authenticationSlice.selectors;

  const isAuthenticated = useSelector(getIsAuthenticated);
  const userRole = useSelector(getUserRole);
  const user = useSelector(getUser);
  const error = useSelector(getError);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const { login: username, password } = credentials;

    dispatch(loginThunk({ login: username, password }));
  };

  const logout = async (): Promise<void> => {
    dispatch(logoutThunk());
  };

  const hasRole = (name: string): boolean => {
    return userRole === name;
  };

  return {
    isAuthenticated,
    user,
    error,
    login,
    logout,
    hasRole,
  };
};
