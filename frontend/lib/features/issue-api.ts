import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./auth-slice";
import { baseQuery } from "../baseQuery";

export interface Issue {
  issue_id: number;
  issue_type: string;
}

export interface CreateIssueRequest {
  issue_type: string;
}

export interface UpdateIssueRequest {
  id: number;
  issue_type: string;
}


const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

export const issueApi = createApi({
  reducerPath: "issueApi",
  baseQuery: baseQueryWithAuth,
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
});

export const {
  useGetIssuesQuery,
  useGetIssueQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
} = issueApi;
