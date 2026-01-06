import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../store"
import { logout } from "./auth-slice"

export interface Service {
  service_id: number
  service_name: string
  issue_id: number
  issue_type: string
}

export interface CreateServiceRequest {
  service_name: string
  issue_id: number
}

export interface UpdateServiceRequest {
  id: number
  service_name: string
  issue_id: number
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

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: baseQueryWithAuth,

  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => "/services",
      providesTags: ["Service"],
    }),
    getService: builder.query<Service, number>({
      query: (id) => `/services/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),
    createService: builder.mutation<{ message: string; service_id: number }, CreateServiceRequest>({
      query: (body) => ({
        url: "/services/new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Service"],
    }),
    updateService: builder.mutation<{ message: string }, UpdateServiceRequest>({
      query: ({ id, ...body }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Service"],
    }),
    deleteService: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApi
