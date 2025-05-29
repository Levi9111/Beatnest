"use client";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserInfo: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => {
        return {
          url: "users",
          method: "PATCH",
          body: credentials,
        };
      },
    }),
    getAllUsers: builder.query({
      query: () => "users",
    }),
    getUserById: builder.query({
      query: (userId) => {
        console.log(userId);
        return {
          url: `users/${userId}`,
        };
      },
    }),
    getUserByEmail: builder.mutation({
      query: ({ email }) => ({
        url: "users",
        method: "POST",
        body: email,
      }),
    }),
  }),
});

export const {
  useUpdateUserInfoMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserByEmailMutation,
  useResetPasswordMutation,
} = userApi;
