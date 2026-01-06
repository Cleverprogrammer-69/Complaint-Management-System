"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
} from "@/lib/features/service-api";
import type { Service } from "@/lib/features/service-api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, PlusCircle, Save, X } from "lucide-react";
import { useGetIssuesQuery } from "@/lib/features/issue-api";

const formSchema = z.object({
  service_name: z.string().min(2, "Service name is required"),
  issue_id:  z.number({ error: "Issue is required" }),
});

type FormData = z.infer<typeof formSchema>;

interface ServiceFormProps {
  editingService?: (Service & { issue_id?: number }) | null;
  onCancelEdit?: () => void;
}

export function ServiceForm({ editingService, onCancelEdit }: ServiceFormProps) {
  const { data: issues, isLoading: isLoadingIssues } = useGetIssuesQuery();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const form = useForm<FormData, unknown, FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service_name: "",
      issue_id: undefined,
    },
  });

  useEffect(() => {
    if (editingService && issues) {
      const issue = issues.find(i => i.issue_type === editingService.issue_type);
      form.reset({
        service_name: editingService.service_name,
        issue_id: issue?.issue_id
      });
    } else {
      form.reset({
        service_name: "",
        issue_id: undefined,
      });
    }
  }, [editingService, form, issues]);
  async function onSubmit(data: FormData) {
    try {
      if (editingService) {
        await updateService({
          
          id: editingService.service_id,
          service_name: data.service_name,
          issue_id: data.issue_id
        }).unwrap();
        toast.success('Service updated successfully!', {
          style: {
            '--normal-bg':
              'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
            '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
          } as React.CSSProperties
        })
        onCancelEdit?.();
      } else {
        await createService({
          service_name: data.service_name,
          issue_id: data.issue_id
        }).unwrap();
        toast.success('Service created successfully!', {
          style: {
            '--normal-bg':
              'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
            '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
          } as React.CSSProperties
        })
      }
      form.reset();
    } catch (error: any) {
      const msg = error?.data?.message || "An unexpected error occurred"
       toast.error(msg, {
          style: {
            '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
            '--normal-text': 'var(--destructive)',
            '--normal-border': 'var(--destructive)'
          } as React.CSSProperties, closeButton: true
        })
    }
  }

  const isLoading = isCreating || isUpdating;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingService ? "Edit Service" : "Create New Service"}</CardTitle>
        <CardDescription>
          {editingService
            ? "Update the service information below"
            : "Add a new service to the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="service_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issue_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      value={field.value?.toString()}
                      disabled={isLoadingIssues}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an issue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issues?.map((issue) => (
                          <SelectItem
                            key={issue.issue_id}
                            value={issue.issue_id.toString()}
                          >
                            {issue.issue_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : editingService ? (
                  <>
                    <Save className="mr-2 size-4" />
                    Update Service
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 size-4" />
                    Create Service
                  </>
                )}
              </Button>
              {editingService && (
                <Button type="button" variant="outline" onClick={onCancelEdit}>
                  <X className="mr-2 size-4" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
