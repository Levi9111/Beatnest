import { baseApi } from "../api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    getMe: builder.query({
      query: () => "/auth/me",
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/login/refresh-token",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});
export const {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useRefreshTokenMutation,
} = authApi;
