"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateDepartmentMutation, useUpdateDepartmentMutation, type Department } from "@/lib/features/department-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Pencil, Loader2 } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

const departmentSchema = z.object({
  deptt_name: z
    .string().trim()
    .min(1, "Department name is required")
    .min(2, "Department name must be at least 2 characters")
    .max(50, "Department name must be less than 50 characters"),
})

type DepartmentFormValues = z.infer<typeof departmentSchema>

interface DepartmentFormProps {
  editingDepartment: Department | null
  onCancelEdit: () => void
}

export function DepartmentForm({ editingDepartment, onCancelEdit }: DepartmentFormProps) {
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation()
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation()

  const isLoading = isCreating || isUpdating
  const isEditing = !!editingDepartment

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      deptt_name: "",
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (editingDepartment) {
      form.reset({ deptt_name: editingDepartment.deptt_name })
    } else {
      form.reset({ deptt_name: "" })
    }
  }, [editingDepartment, form])

  async function onSubmit(data: DepartmentFormValues) {
    try {
      if (isEditing && editingDepartment) {
        await updateDepartment({ id: editingDepartment.deptt_id, deptt_name: data.deptt_name }).unwrap()
        onCancelEdit()
      } else {
        await createDepartment({ deptt_name: data.deptt_name }).unwrap()
      }
      form.reset()
    } catch (error: any) {
      const msg = error?.data?.message || "An unexpected error occurred"
      console.log("Failed to save department:", error)
     toast.error(msg, {
          style: {
            '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
            '--normal-text': 'var(--destructive)',
            '--normal-border': 'var(--destructive)'
          } as React.CSSProperties, closeButton: true
        })
      form.setError("deptt_name", { type: "manual", message: msg })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Pencil className="size-5" />
              Edit Department
            </>
          ) : (
            <>
              <Plus className="size-5" />
              Create New Department
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update the department type details below" : "Add a new department type to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="deptt_name"
              render={({ field }) => (
                <FormItem className="flex-1 block">
                  <FormLabel className="mb-2">Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter department type (e.g., Bug, Feature Request)" {...field} autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end gap-2 ml-auto">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {isEditing ? "Update" : "Create"}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={onCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
