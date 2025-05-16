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
    getAllUsers: builder.query({
      query: () => "users",
    }),
    getUserById: builder.query({
      query: ({ id }) => `users/${id}`,
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
} = userApi;
