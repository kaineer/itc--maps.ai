// HACK

const userRoles = ["User", "Creator", "Admin"];

export const getRoleIndex = (role: string): number => {
  return userRoles.indexOf(role);
};

export const getRoleName = (roleIdx: number): string => {
  return userRoles[roleIdx];
};
