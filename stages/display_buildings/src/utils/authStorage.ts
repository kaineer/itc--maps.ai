// interface TokenStorage {
//   setToken: (token: string) => void;
//   getToken: () => string | null;
//   dropToken: () => void;
// }

// type BrowserStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

// export const createAuthStorage = (
//   storage: BrowserStorage = localStorage,
// ): TokenStorage => {
//   const authTokenKey = "auth/access";

//   return {
//     setToken(token: string) {
//       storage.setItem(authTokenKey, token);
//     },
//     getToken() {
//       return storage.getItem(authTokenKey);
//     },
//     dropToken() {
//       storage.removeItem(authTokenKey);
//     },
//   };
// };
