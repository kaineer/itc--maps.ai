import {
  authenticationSlice,
  loginThunk,
  logoutThunk,
  authFromLocalStorage,
} from "./model/authentication.slice";
import { useAuthentication } from "./lib/useAuthentication";

export type {
  AuthHookType,
  AuthResponse,
  AuthState,
  LoginCredentials,
  UserJWTData,
} from "./model/types";
export {
  authenticationSlice,
  loginThunk,
  logoutThunk,
  authFromLocalStorage,
  useAuthentication,
};

export { Allow } from "./ui/Allow";
export { AllowRoute } from "./ui/AllowRoute";
