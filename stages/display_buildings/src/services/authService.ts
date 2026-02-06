import { User } from "src/types/types";

const serviceKey: string = "auth/access";

type AuthStorage = Pick<Storage, "setItem" | "removeItem" | "getItem">;

interface AuthHeaders {
  Authorization?: string;
}

export interface AuthService {
  store: (token: string) => void;
  drop: () => void;
  getHeaders: () => AuthHeaders;
  getUser: () => User | null;
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

  const getHeaders = () => {
    const token = storage.getItem(key);
    if (token) {
      return {
        Authorization: "Bearer " + token,
      };
    }
    return {};
  };

  const getUser = (): User | null => {
    const token = storage.getItem(key);
    if (token) {
      const [_, right] = token.split(".");
      const data = JSON.parse(atob(right));

      return {
        login: data.name,
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
