import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./auth-slice";

export interface Role {
  role_id: number;
  role_name: string;
}

export interface CreateRoleRequest {
  role_name: string;
}

export interface UpdateRoleRequest {
  id: number;
  role_name: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api",
  credentials: "include",
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Role"],
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => "/roles",
      providesTags: ["Role"],
    }),
    getRole: builder.query<Role, number>({
      query: (id) => `/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Role", id }],
    }),
    createRole: builder.mutation<{ message: string }, CreateRoleRequest>({
      query: (body) => ({
        url: "/roles/new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Role"],
    }),
    updateRole: builder.mutation<{ message: string }, UpdateRoleRequest>({
      query: ({ id, role_name }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: { role_name },
      }),
      invalidatesTags: ["Role"],
    }),
    deleteRole: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
