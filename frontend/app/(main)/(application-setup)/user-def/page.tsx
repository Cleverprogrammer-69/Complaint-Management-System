"use client"

import { useState } from "react"
import { UserForm } from "@/components/forms/user-form"
import { useGetUsersQuery, useDeleteUserMutation } from "@/lib/features/user-api"
import { createColumns, type User } from "./columns"
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

export default function UserDefPage() {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const { data: users, isLoading, isError, refetch } = useGetUsersQuery()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  async function handleDelete() {
    if (!deletingUser) return
    try {
      await deleteUser(deletingUser.user_id).unwrap()
      setDeletingUser(null)
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  const columns = createColumns(
    (user) => setEditingUser(user),
    (user) => setDeletingUser(user),
  )

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Definition</h1>
          <p className="text-muted-foreground">Manage system users</p>
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
          <h1 className="text-2xl font-bold tracking-tight">User Definition</h1>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="size-12 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">Failed to load users</p>
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
        <h1 className="text-2xl font-bold tracking-tight">User Definition</h1>
        <p className="text-muted-foreground">Manage system users</p>
      </div>

      <UserForm editingUser={editingUser} onCancelEdit={() => setEditingUser(null)} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="size-5" />
            Users List
          </CardTitle>
          <CardDescription>
            {users?.length ?? 0} user{(users?.length ?? 0) !== 1 && "s"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <DataTable columns={columns} data={users} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm text-muted-foreground">Create your first user using the form above</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingUser?.name}&quot;? This action cannot be undone.
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
