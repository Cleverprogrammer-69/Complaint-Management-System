import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Issue {
  issue_id: number
  issue_type: string
}

export interface CreateIssueRequest {
  issue_type: string
}

export interface UpdateIssueRequest {
  id: number
  issue_type: string
}

export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api" }),
  tagTypes: ["Issue"],
  endpoints: (builder) => ({
    getIssues: builder.query<Issue[], void>({
      query: () => "/issues",
      providesTags: ["Issue"],
    }),
    getIssue: builder.query<Issue, number>({
      query: (id) => `/issues/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Issue", id }],
    }),
    createIssue: builder.mutation<{ message: string }, CreateIssueRequest>({
      query: (body) => ({
        url: "/issues/new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Issue"],
    }),
    updateIssue: builder.mutation<{ message: string }, UpdateIssueRequest>({
      query: ({ id, issue_type }) => ({
        url: `/issues/${id}`,
        method: "PUT",
        body: { issue_type },
      }),
      invalidatesTags: ["Issue"],
    }),
    deleteIssue: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Issue"],
    }),
  }),
})

export const {
  useGetIssuesQuery,
  useGetIssueQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issueApi
