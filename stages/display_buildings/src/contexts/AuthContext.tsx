import { createContext, ReactNode, useEffect, useState } from "react";
import { createAuthService } from "@services/authService";
import {
  AuthenticationError,
  BackendService,
  createBackendService,
} from "@services/backendService";
import { AuthState, LoginCredentials } from "src/types/auth-types";

export interface AuthContextType extends AuthState, BackendService {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(void 0);

interface Props {
  children: ReactNode;
}

type Fetcher = (endpoint: string, body?: unknown) => Promise<unknown | void>;

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

    return () => authService.drop();
  }, []);

  const login = async ({ login, password }: LoginCredentials) => {
    const result = await backendService.post("users/login", {
      body: { login, password },
    });

    if (result && typeof result === "object") {
      if ("success" in result && "accessToken" in result) {
        authService.store(String(result.accessToken));

        setAuthState({
          user: authService.getUser(),
          isAuthenticated: true,
          error: null,
        });
      }
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
        return fn(endpoint, body);
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
