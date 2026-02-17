import { User } from "@.types/auth-types";
import { UserResponse } from "@.types/user-request-types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBackendService } from "@services/backendService";

const backendService = createBackendService();
const { baseQuery } = backendService;

const roleNames = ["User", "Creator", "Admin"];

const fixRole = (u0: UserResponse): User => {
  return {
    ...u0,
    role: roleNames[u0.role],
  };
};

export const userApi = createApi({
  reducerPath: "user/api",
  baseQuery,
  tagTypes: ["userList"],
  endpoints: (build) => ({
    getUserList: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["userList"],
      transformResponse: (data) =>
        Array.isArray(data) ? data.map((u0) => fixRole(u0)) : [],
    }),
  }),
});

export const { useGetUserListQuery } = userApi;
