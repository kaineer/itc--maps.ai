import { User } from "./auth-types";

export type CreateUser = Omit<User, "id">;

export type UserResponse = Omit<User, "role"> & { role: number };
