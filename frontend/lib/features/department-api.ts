import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Department {
  deptt_id: number
  deptt_name: string
}

export interface CreateDepartmentRequest {
  deptt_name: string
}

export interface UpdateDepartmentRequest {
  id: number
  deptt_name: string
}

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api" }),
  tagTypes: ["Department"],
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => "/departments",
      providesTags: ["Department"],
    }),
    getDepartment: builder.query<Department, number>({
      query: (id) => `/departments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Department", id }],
    }),
    createDepartment: builder.mutation<{ message: string }, CreateDepartmentRequest>({
      query: (body) => ({
        url: "/departments/new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Department"],
    }),
    updateDepartment: builder.mutation<{ message: string }, UpdateDepartmentRequest>({
      query: ({ id, deptt_name }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body: { deptt_name },
      }),
      invalidatesTags: ["Department"],
    }),
    deleteDepartment: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
})

export const {
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi
