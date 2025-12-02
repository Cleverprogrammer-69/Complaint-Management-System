"use client";

import { useState } from "react";
import { DepartmentForm } from "@/components/department-form";
import {
  useGetDepartmentsQuery,
  useDeleteDepartmentMutation,
} from "@/lib/features/department-api";
import { createColumns, type Department } from "./columns";
import { DataTable } from "./data-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, List } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DepartmentDefPage() {
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);
  const {
    data: departments,
    isLoading,
    isError,
    refetch,
  } = useGetDepartmentsQuery();
  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteDepartmentMutation();
  async function handleDelete() {
    if (!deletingDepartment) return;
    try {
      await deleteDepartment(deletingDepartment.deptt_id).unwrap();
      setDeletingDepartment(null);
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  }

  const columns = createColumns(
    (department) => setEditingDepartment(department),
    (department) => setDeletingDepartment(department)
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Department Definition
          </h1>
          <p className="text-muted-foreground">
            Manage departments for your application
          </p>
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
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Department Definition
          </h1>
          <p className="text-muted-foreground">
            Manage departments for your application
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="size-12 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive">
              Failed to load departments
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Please check if the backend server is running
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Department Definition
        </h1>
        <p className="text-muted-foreground">
          Manage departments for your application
        </p>
      </div>

      <DepartmentForm
        editingDepartment={editingDepartment}
        onCancelEdit={() => setEditingDepartment(null)}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="size-5" />
            Departments List
          </CardTitle>
          <CardDescription>
            {departments?.length ?? 0} department
            {(departments?.length ?? 0) !== 1 && "s"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {departments && departments.length > 0 ? (
            <DataTable columns={columns} data={departments} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No departments found</p>
              <p className="text-sm text-muted-foreground">
                Create your first department using the form above
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deletingDepartment}
        onOpenChange={() => setDeletingDepartment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {deletingDepartment?.deptt_name}&quot;? This action cannot be
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
  );
}
