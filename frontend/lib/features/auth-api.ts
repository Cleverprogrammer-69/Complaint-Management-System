import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { logout } from "./auth-slice"

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  accessToken: string
  user: {
    id: number
    name: string
    role: string
  }
}

export interface RegisterRequest {
  name: string
  phone: string
  email: string
  role_id: number
  is_team_member?: boolean
}

export interface RegisterResponse {
  message: string
  user_id: number
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL, credentials: "include" }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (error) {
          // Optionally dispatch logout even on error if needed
          console.error("Logout failed:", error);
        }
      },
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/users/new",
        method: "POST",
        body: userData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    refresh: builder.query<{ accessToken: string }, void>({
      query: () => "/auth/refresh",
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation, useRefreshQuery, useLogoutMutation } = authApi
