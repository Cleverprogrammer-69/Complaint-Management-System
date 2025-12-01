"use client"

import { useState } from "react"
import { IssueForm } from "@/components/issue-form"
import { useGetIssuesQuery, useDeleteIssueMutation } from "@/lib/features/issue-api"
import { createColumns, type Issue } from "./columns"
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

export default function IssueDefPage() {
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null)
  const [deletingIssue, setDeletingIssue] = useState<Issue | null>(null)
  const { data: issues, isLoading, isError, refetch } = useGetIssuesQuery()
  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation()

  async function handleDelete() {
    if (!deletingIssue) return
    try {
      await deleteIssue(deletingIssue.issue_id).unwrap()
      setDeletingIssue(null)
    } catch (error) {
      console.error("Failed to delete issue:", error)
    }
  }

  const columns = createColumns(
    (issue) => setEditingIssue(issue),
    (issue) => setDeletingIssue(issue),
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Issue Definition</h1>
          <p className="text-muted-foreground">Manage issue types for your application</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Issue Definition</h1>
          <p className="text-muted-foreground">Manage issue types for your application</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="size-12 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">Failed to load issues</p>
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
        <h1 className="text-2xl font-bold tracking-tight">Issue Definition</h1>
        <p className="text-muted-foreground">Manage issue types for your application</p>
      </div>

      <IssueForm editingIssue={editingIssue} onCancelEdit={() => setEditingIssue(null)} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="size-5" />
            Issues List
          </CardTitle>
          <CardDescription>
            {issues?.length ?? 0} issue{(issues?.length ?? 0) !== 1 && "s"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {issues && issues.length > 0 ? (
            <DataTable columns={columns} data={issues} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No issues found</p>
              <p className="text-sm text-muted-foreground">Create your first issue using the form above</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingIssue} onOpenChange={() => setDeletingIssue(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Issue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingIssue?.issue_type}&quot;? This action cannot be undone.
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
