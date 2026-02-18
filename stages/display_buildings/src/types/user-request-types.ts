import { User } from "./auth-types";

interface BackendRole {
  role: number;
}

export type CreateUser = Omit<User, "id" | "role"> &
  BackendRole & { password: string };

export type UserResponse = Omit<User, "role"> & BackendRole;
