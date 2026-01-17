"use client"

import { useGetMyTasksQuery } from "@/lib/features/resolver-api"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckIcon as ChecklistIcon } from "lucide-react"

export default function ResolverTasksPage() {
  const { data: tasks, isLoading, isError, refetch } = useGetMyTasksQuery()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">View and manage all tasks assigned to you</p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">View and manage all tasks assigned to you</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="size-12 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">Failed to load tasks</p>
            <p className="text-sm text-muted-foreground mb-4">Please check if the backend server is running</p>
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
        <p className="text-muted-foreground">View and manage all tasks assigned to you</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChecklistIcon className="size-5" />
            Assigned Tasks
          </CardTitle>
          <CardDescription>{tasks?.length ?? 0} task(s) assigned</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks && tasks.length > 0 ? (
            <DataTable columns={columns} data={tasks} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No tasks assigned</p>
              <p className="text-sm text-muted-foreground">You will see tasks once they are assigned by an admin</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
