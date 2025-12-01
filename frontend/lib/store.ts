import { configureStore } from "@reduxjs/toolkit"
import { issueApi } from "./features/issue-api"

export const store = configureStore({
  reducer: {
    [issueApi.reducerPath]: issueApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(issueApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
