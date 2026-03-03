import { User, UserId } from "@.types/auth-types";
import {
  CreateUser,
  UpdateUser,
  UserResponse,
} from "@.types/user-request-types";
import { createApi } from "@reduxjs/toolkit/query/react";
import { createBackendService } from "@services/backendService";
import { getRoleName } from "@utils/roles";

const backendService = createBackendService();
const { baseQuery } = backendService;

const fixRole = (u0: UserResponse): User => {
  return {
    ...u0,
    role: getRoleName(u0.role),
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
    putUser: build.mutation<User, UpdateUser>({
      query: ({ id, ...patch }) => ({
        url: "/users/" + id,
        method: "PUT",
        body: patch,
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
  usePutUserMutation,
  usePostUserMutation,
  useDeleteUserMutation,
} = userApi;
