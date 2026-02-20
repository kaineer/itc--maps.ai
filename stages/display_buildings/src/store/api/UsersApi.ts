import { User, UserId } from "@.types/auth-types";
import { CreateUser, UserResponse } from "@.types/user-request-types";
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
    postUser: build.mutation<User, Partial<CreateUser>>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["userList"],
    }),
    getUserList: build.query<User[], void>({
      query: () => "/users",
      providesTags: ["userList"],
      transformResponse: (data) =>
        Array.isArray(data) ? data.map((u0) => fixRole(u0)) : [],
    }),
    deleteUser: build.mutation<void, UserId>({
      query: (userId) => ({
        url: "/users/" + userId,
        method: "DELETE",
      }),
      invalidatesTags: ["userList"],
    }),
  }),
});

export const {
  useGetUserListQuery,
  usePostUserMutation,
  useDeleteUserMutation,
} = userApi;
