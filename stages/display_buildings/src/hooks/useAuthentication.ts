import { postBackend } from "@utils/backend";
import { createAuthToken } from "@utils/authToken";
import { useState } from "react";

interface UserData {
  username: string;
  role: string;
  expiresAt: number;
}

type LoginSuccessResult = UserData & { success: true };

interface LoginFailureResult {
  success: false;
  message: string;
}

type LoginResult = LoginSuccessResult | LoginFailureResult;

export interface AuthResult {
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  getToken: () => string | null;
  username: string | null;
  expiresAt: number | null;
  role: string | null;
}

interface TokenStorage {
  setToken: (token: string) => void;
  getToken: () => string | null;
  dropToken: () => void;
}

type BrowserStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export const createTokenStorage = (
  storage: BrowserStorage = localStorage,
): TokenStorage => {
  const authTokenKey = "auth/token";

  return {
    setToken(token: string) {
      storage.setItem(authTokenKey, token);
    },
    getToken() {
      return storage.getItem(authTokenKey);
    },
    dropToken() {
      storage.removeItem(authTokenKey);
    },
  };
};

export const useAuthentication = (
  storage: BrowserStorage = localStorage,
): AuthResult => {
  const authStorage: TokenStorage = createTokenStorage(storage);

  const [accessToken, setAccessToken] = useState<string | null>(
    authStorage.getToken(),
  );

  const updateToken = (value: string | null) => {
    if (typeof value === "string") {
      authStorage.setToken(value);
    } else {
      authStorage.dropToken();
    }
    setAccessToken(value);
  };

  const login = async (
    username: string,
    password: string,
  ): Promise<LoginResult> => {
    const response = await postBackend("users/login", {
      login: username,
      password,
    });

    if (response.success) {
      const { accessToken: token } = response;

      updateToken(token);

      return {
        success: true,
        ...getUser0(token),
      };
    } else {
      updateToken(null);

      return {
        success: false,
        message: response.message,
      };
    }
  };

  const logout = () => {
    updateToken(null);
  };

  const getUser0 = (token: string): UserData => {
    const { username, role, expiresAt } = createAuthToken(token);
    return { username, role, expiresAt };
  };

  const getUser: () => UserData | null = () => {
    return typeof accessToken === "string" ? getUser0(accessToken) : null;
  };

  const { username = null, expiresAt = null, role = null } = getUser() || {};

  return {
    login,
    logout,
    getToken: () => authStorage.getToken(),
    username,
    expiresAt,
    role,
  };
};
