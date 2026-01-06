"use client"

import { useState } from "react"
import { ServiceForm } from "@/components/forms/service-form"
import { useGetServicesQuery, useDeleteServiceMutation } from "@/lib/features/service-api"
import { createColumns, type Service } from "./columns"
import { DataTable } from "./data-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle, List } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ServiceDefPage() {
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingService, setDeletingService] = useState<Service | null>(null)
  const { data: services, isLoading, isError, refetch } = useGetServicesQuery()
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation()

  async function handleDelete() {
    if (!deletingService) return
    try {
      await deleteService(deletingService.service_id).unwrap()
      setDeletingService(null)
    } catch (error) {
      console.error("Failed to delete service:", error)
    }
  }

  const columns = createColumns(
    (service) => setEditingService(service),
    (service) => setDeletingService(service),
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Definition</h1>
          <p className="text-muted-foreground">Manage system services</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Service Definition</h1>
          <p className="text-muted-foreground">Manage system services</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="size-12 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">Failed to load services</p>
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
        <h1 className="text-2xl font-bold tracking-tight">Service Definition</h1>
        <p className="text-muted-foreground">Manage system services</p>
      </div>

      <ServiceForm editingService={editingService} onCancelEdit={() => setEditingService(null)} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="size-5" />
            Services List
          </CardTitle>
          <CardDescription>
            {services?.length ?? 0} service{(services?.length ?? 0) !== 1 && "s"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services && services.length > 0 ? (
            <DataTable columns={columns} data={services} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No services found</p>
              <p className="text-sm text-muted-foreground">Create your first service using the form above</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingService} onOpenChange={() => setDeletingService(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingService?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
