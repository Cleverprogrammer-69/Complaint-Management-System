"use client"

import { useEffect, useState } from "react"
import { useGetAllResolversQuery } from "@/lib/features/resolver-api"
import { createColumns } from "./columns"
import type { Resolver } from "@/lib/features/resolver-api"
import { DataTable } from "./data-table"
import { ResolverAssignmentForm } from "@/components/forms/resolver-assignment-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle, Users } from "lucide-react"

export default function ResolverManagementPage() {
  const [editingResolver, setEditingResolver] = useState<Resolver | null>(null)
  const { data: resolvers, isLoading, isError, refetch } = useGetAllResolversQuery()
  useEffect(() => {
    console.log("Resolvers updated:", resolvers)
  }, [resolvers])
    console.log(resolvers)
  const columns = createColumns(
    (resolver) => setEditingResolver(resolver),
    () => {},
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resolver Management</h1>
          <p className="text-muted-foreground">Manage resolver assignments and responsibilities</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Resolver Management</h1>
          <p className="text-muted-foreground">Manage resolver assignments and responsibilities</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="size-12 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">Failed to load resolvers</p>
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
        <h1 className="text-2xl font-bold tracking-tight">Resolver Management</h1>
        <p className="text-muted-foreground">Manage resolver assignments and responsibilities</p>
      </div>

      {editingResolver && (
        <ResolverAssignmentForm resolver={editingResolver} onCancel={() => setEditingResolver(null)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Resolvers List
          </CardTitle>
          <CardDescription>{resolvers?.length ?? 0} resolver(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          {resolvers && resolvers.length > 0 ? (
            <DataTable columns={columns} data={resolvers} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No resolvers found</p>
              <p className="text-sm text-muted-foreground">Create resolver users to manage their assignments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
