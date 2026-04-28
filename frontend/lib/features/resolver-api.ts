import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "./auth-slice";
import { baseQuery } from "../baseQuery";

export interface Resolver {
  user_id: number
  name: string
  email: string
  created_at: string
  role_name: string
  services: string | null
  departments: string | null
}

export interface ResolverTask {
  complaint_id: number;
  complaint_detail: string;
  status: string;
  created_at: string;
  deptt_name: string;
  service_name: string;
  complaint_by: string;
}

export interface AssignResolverRequest {
  resolverId: number;
  department_ids: number[];
  service_ids: number[];
}

// const baseQuery = fetchBaseQuery({
//   baseUrl: "http://localhost:4000/api",
//   credentials: "include",
// });

const baseQueryWithAuth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const resolverApi = createApi({
  reducerPath: "resolverApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Resolver"],
  endpoints: (builder) => ({
    getAllResolvers: builder.query<Resolver[], void>({
      query: () => "/resolvers",
      providesTags: ["Resolver"],
    }),
    getResolverById: builder.query<Resolver, number>({
      query: (id) => `/resolvers/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Resolver", id }],
    }),
    getResolverTasks: builder.query<ResolverTask[], number>({
      query: (resolverId) => `/resolvers/${resolverId}/tasks`,
      providesTags: (_result, _error, id) => [{ type: "Resolver", id }],
    }),
    getMyTasks: builder.query<ResolverTask[], void>({
      query: () => "/resolvers/tasks/me",
      providesTags: ["Resolver"],
    }),
    assignJobToResolver: builder.mutation<
      { message: string },
      AssignResolverRequest
    >({
      query: ({ resolverId, ...body }) => ({
        url: `/resolvers/${resolverId}/assignments`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Resolver"],
    }),
  }),
});
export const {
  useGetAllResolversQuery,
  useGetResolverByIdQuery,
  useGetResolverTasksQuery,
  useGetMyTasksQuery,
  useAssignJobToResolverMutation,
} = resolverApi;
