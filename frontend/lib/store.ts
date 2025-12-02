import { configureStore } from "@reduxjs/toolkit";
import { issueApi } from "./features/issue-api";
import { departmentApi } from "./features/department-api";
import { complaintApi } from "./features/complaint-api";

export const store = configureStore({
  reducer: {
    [issueApi.reducerPath]: issueApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [complaintApi.reducerPath]: complaintApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      issueApi.middleware,
      departmentApi.middleware,
      complaintApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
