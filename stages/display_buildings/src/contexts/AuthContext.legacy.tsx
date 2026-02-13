import { createContext, ReactNode, useEffect, useState } from "react";
import { createAuthService } from "@services/authService";
import {
  AuthenticationError,
  BackendService,
  createBackendService,
} from "@services/backendService";
import {
  AuthResponse,
  AuthState,
  LoginCredentials,
} from "src/types/auth-types";

export interface AuthContextType extends AuthState, BackendService {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(void 0);

export const isAuthResponse = (obj: unknown): obj is AuthResponse => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "success" in obj &&
    obj.success &&
    "accessToken" in obj &&
    typeof obj.accessToken === "string"
  );
};

interface Props {
  children: ReactNode;
}

type Fetcher = (
  endpoint: string,
  body?: unknown,
) => Promise<Response | unknown | void>;

export const AuthProvider = ({ children }: Props) => {
  //
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    error: null,
  });

  const authService = createAuthService();
  const backendService = createBackendService();

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        error: null,
      });
    }
  }, []);

  const login = async ({ login, password }: LoginCredentials) => {
    const result = await backendService.post("users/login", {
      login,
      password,
    });

    if (isAuthResponse(result)) {
      authService.store(String(result.accessToken));

      setAuthState({
        user: authService.getUser(),
        isAuthenticated: true,
        error: null,
      });
    }
  };

  const logout = () => {
    setAuthState({
      ...authState,
      user: null,
      isAuthenticated: false,
    });
  };

  const hasRole = (role: string) => {
    return authState?.user?.role === role;
  };

  const wrapFetch = <T extends Fetcher>(fn: T): T => {
    return (async (endpoint: string, body: unknown) => {
      try {
        if (body) return fn(endpoint, body);
        return fn(endpoint);
      } catch (err) {
        if (err instanceof AuthenticationError) {
          logout();
        }
      }
    }) as T;
  };

  const wrapBackend = {
    get: wrapFetch(backendService.get),
    post: wrapFetch(backendService.post),
    put: wrapFetch(backendService.put),
    del: wrapFetch(backendService.del),
    patch: wrapFetch(backendService.patch),
    download: wrapFetch(backendService.download),
    upload: wrapFetch(backendService.upload),
    // NOTE: this one does not change
    urlForEndpoint: backendService.urlForEndpoint,
  };

  const contextValue: AuthContextType = {
    ...authState,
    ...wrapBackend,
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
