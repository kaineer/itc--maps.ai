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

interface BackendRole {
  role: number;
}

export type CreateUser = Omit<User, "id" | "role"> &
  BackendRole & { password: string };

export type UpdateUser = { id: User["id"]; role: number } & Partial<
  Omit<User, "id" | "role">
>;

export type UserResponse = Omit<User, "role"> & BackendRole;
