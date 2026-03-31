import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "./auth-slice";

export interface Complaint {
  complaint_id: number;
  complaint_detail: string;
  status: string;
  created_at: string;
  updated_at: string;
  deptt_name: string;
  issue_type: string;
}

export interface CreateComplaintRequest {
  department_id: number;
  issue_id: number;
  complaint_detail: string;
  status?: string;
}

export interface UpdateComplaintRequest {
  id: number;
  department_id?: number;
  issue_id?: number;
  complaint_detail?: string;
  status?: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/api",
  credentials: "include",
});

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

export const complaintApi = createApi({
  reducerPath: "complaintApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Complaint"],
  endpoints: (builder) => ({
    getAllComplaints: builder.query<Complaint[], void>({
      query: () => "/complaints",
      providesTags: ["Complaint"],
    }),
    getComplaints: builder.query<Complaint[], void>({
      query: () => "/complaints/my-complaints",
      providesTags: ["Complaint"],
    }),
    getComplaint: builder.query<Complaint, number>({
      query: (id) => `/complaints/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Complaint", id }],
    }),
    createComplaint: builder.mutation<
      { message: string },
      CreateComplaintRequest
    >({
      query: (body) => ({
        url: "/complaints/new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Complaint"],
    }),
    updateComplaint: builder.mutation<
      { message: string },
      UpdateComplaintRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/complaints/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Complaint"],
    }),
    deleteComplaint: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/complaints/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Complaint"],
    }),
  }),
});

export const {
  useGetAllComplaintsQuery,
  useGetComplaintsQuery,
  useGetComplaintQuery,
  useCreateComplaintMutation,
  useUpdateComplaintMutation,
  useDeleteComplaintMutation,
} = complaintApi;
