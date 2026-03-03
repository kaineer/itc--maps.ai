export type UserId = string;

export interface User {
  id: UserId;
  login: string;
  email: string;
  name: string;
  phone: string;
  schoolName: string;
  role: string;
}

export type UserJWTData = Pick<User, "login" | "role">;

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
