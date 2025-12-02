import { configureStore } from "@reduxjs/toolkit"
import { issueApi } from "./features/issue-api"
import { departmentApi } from "./features/department-api"

export const store = configureStore({
  reducer: {
    [issueApi.reducerPath]: issueApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(issueApi.middleware, departmentApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
