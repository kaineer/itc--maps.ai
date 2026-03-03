import { UserJWTData } from "@.types/auth-types";

const serviceKey: string = "auth/access";

type AuthStorage = Pick<Storage, "setItem" | "removeItem" | "getItem">;

interface AuthHeaders {
  Authorization?: string;
}

export interface AuthService {
  store: (token: string) => void;
  drop: () => void;
  getHeaders: () => AuthHeaders;
  getUser: () => UserJWTData | null;
}

export const createAuthService = (
  key: string = serviceKey,
  storage: AuthStorage = localStorage,
): AuthService => {
  const store = (token: string) => {
    storage.setItem(key, token);
  };

  const drop = () => {
    storage.removeItem(key);
  };

  const getHeaders = (): AuthHeaders => {
    const token = storage.getItem(key);
    if (token) {
      return {
        Authorization: "Bearer " + token,
      };
    }
    return {};
  };

  const getUser = (): UserJWTData | null => {
    const token = storage.getItem(key);
    if (token) {
      const [_, right] = token.split(".");
      const data = JSON.parse(atob(right));
      const hasExpired = data.exp < Date.now() / 1000;

      if (hasExpired) return null;

      return {
        login: data.unique_name,
        role: data.role,
      };
    }

    return null;
  };

  return {
    store,
    drop,
    getHeaders,
    getUser,
  };
};
