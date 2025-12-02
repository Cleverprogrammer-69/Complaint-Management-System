"use client"

import { useState } from "react"
import { ComplaintForm } from "@/components/complaint-form"
import { useGetComplaintsQuery, useDeleteComplaintMutation, type Complaint } from "@/lib/features/complaint-api"
import { createColumns } from "./columns"
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

export default function ComplaintsPage() {
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null)
  const [deletingComplaint, setDeletingComplaint] = useState<Complaint | null>(null)
  const { data: complaints, isLoading, isError, refetch } = useGetComplaintsQuery()
  const [deleteComplaint, { isLoading: isDeleting }] = useDeleteComplaintMutation()

  async function handleDelete() {
    if (!deletingComplaint) return
    try {
      await deleteComplaint(deletingComplaint.complaint_id).unwrap()
      setDeletingComplaint(null)
    } catch (error) {
      console.error("Failed to delete complaint:", error)
    }
  }

  const columns = createColumns(
    (complaint) => setEditingComplaint(complaint),
    (complaint) => setDeletingComplaint(complaint),
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground">Manage complaints for your application</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground">Manage complaints for your application</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="size-12 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">Failed to load complaints</p>
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
        <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>
        <p className="text-muted-foreground">Manage complaints for your application</p>
      </div>

      <ComplaintForm editingComplaint={editingComplaint} onCancelEdit={() => setEditingComplaint(null)} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="size-5" />
            Complaints List
          </CardTitle>
          <CardDescription>
            {complaints?.length ?? 0} complaint{(complaints?.length ?? 0) !== 1 && "s"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {complaints && complaints.length > 0 ? (
            <DataTable columns={columns} data={complaints} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No complaints found</p>
              <p className="text-sm text-muted-foreground">Create your first complaint using the form above</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingComplaint} onOpenChange={() => setDeletingComplaint(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete complaint #{deletingComplaint?.complaint_id}? This action cannot be
              undone.
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
