type UserRole = "Admin" | "Creator" | "User";

interface AuthToken {
  username: string;
  role: UserRole;
  expiresAt: number;
  headers: {
    Authorization: string;
  };
}

export const createAuthToken = (token: string): AuthToken => {
  const [_, dataString] = token.split(".");
  const { unique_name: username, role, exp } = JSON.parse(atob(dataString));

  return {
    username,
    role,
    expiresAt: exp * 1000,
    headers: {
      Authorization: "Bearer " + token,
    },
  };
};
