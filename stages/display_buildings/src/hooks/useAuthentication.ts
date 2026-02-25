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

  const {
    getIsAuthenticated,
    getUser,
    getUserRole,
    getError,
    getErrorDescription,
    getStarting,
  } = authenticationSlice.selectors;
  const { cleanError: cleanErrorAction } = authenticationSlice.actions;

  const isAuthenticated = useSelector(getIsAuthenticated);
  const userRole = useSelector(getUserRole);
  const user = useSelector(getUser);
  const error = useSelector(getError);
  const errorDescription = useSelector(getErrorDescription);
  const starting = useSelector(getStarting);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const { login: username, password } = credentials;

    dispatch(loginThunk({ login: username, password }));
  };

  const logout = async (): Promise<void> => {
    dispatch(logoutThunk());
  };

  const cleanError = () => {
    dispatch(cleanErrorAction());
  };

  const hasRole = (name: string): boolean => {
    return userRole === name;
  };

  return {
    isAuthenticated,
    user,
    error: {
      title: error,
      description: errorDescription,
    },
    starting,
    cleanError,
    login,
    logout,
    hasRole,
  };
};
