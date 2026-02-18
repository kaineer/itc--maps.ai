export interface User {
  id: string;
  login: string;
  email: string;
  name: string;
  phone: string;
  schoolName: string;
  role: string;
}

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
  error: string | null;
  isAuthenticated: boolean;
  starting: boolean;
}

export interface AuthHookType extends AuthState {
  cleanError: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}
