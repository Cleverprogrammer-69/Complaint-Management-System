"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateIssueMutation, useUpdateIssueMutation, type Issue } from "@/lib/features/issue-api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Pencil, Loader2 } from "lucide-react"
import { useEffect } from "react"

const issueSchema = z.object({
  issue_type: z
    .string().trim()
    .min(1, "Issue type is required")
    .min(2, "Issue type must be at least 2 characters")
    .max(50, "Issue type must be less than 50 characters"),
})

type IssueFormValues = z.infer<typeof issueSchema>

interface IssueFormProps {
  editingIssue: Issue | null
  onCancelEdit: () => void
}

export function IssueForm({ editingIssue, onCancelEdit }: IssueFormProps) {
  const [createIssue, { isLoading: isCreating }] = useCreateIssueMutation()
  const[] = useCreateIssueMutation()
  const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation()

  const isLoading = isCreating || isUpdating
  const isEditing = !!editingIssue

  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      issue_type: "",
    },
  })

  // Populate form when editing
  useEffect(() => {
    if (editingIssue) {
      form.reset({ issue_type: editingIssue.issue_type })
    } else {
      form.reset({ issue_type: "" })
    }
  }, [editingIssue, form])

  async function onSubmit(data: IssueFormValues) {
    try {
      if (isEditing && editingIssue) {
        await updateIssue({ id: editingIssue.issue_id, issue_type: data.issue_type }).unwrap()
        onCancelEdit()
      } else {
        await createIssue({ issue_type: data.issue_type }).unwrap()
      }
      form.reset()
    } catch (error) {
      console.log("Failed to save issue:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Pencil className="size-5" />
              Edit Issue
            </>
          ) : (
            <>
              <Plus className="size-5" />
              Create New Issue
            </>
          )}
        </CardTitle>
        <CardDescription>
          {isEditing ? "Update the issue type details below" : "Add a new issue type to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="issue_type"
              render={({ field }) => (
                <FormItem className="flex-1 block">
                  <FormLabel className="mb-2">Issue Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter issue type (e.g., Bug, Feature Request)" {...field} autoFocus />
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
