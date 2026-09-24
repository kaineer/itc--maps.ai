import type { User } from "@entities/users";

export type { UserJWTData } from "@shared/model/auth-types";

export interface AuthResponse {
  success: true;
  accessToken: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  error: {
    title: string | null;
    description: string | null;
  } | null;
  isAuthenticated: boolean;
  starting: boolean;
}

export interface AuthHookType extends AuthState {
  cleanError: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}
