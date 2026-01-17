"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAssignJobToResolverMutation } from "@/lib/features/resolver-api";
import { useGetDepartmentsQuery } from "@/lib/features/department-api";
import { useGetServicesQuery } from "@/lib/features/service-api";
import type { Resolver } from "@/lib/features/resolver-api";
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
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";

const formSchema = z.object({
  department_ids: z.array(z.number()).min(1, "Select at least one department"),
  service_ids: z.array(z.number()).min(1, "Select at least one service"),
});

type FormData = z.infer<typeof formSchema>;

interface ResolverAssignmentFormProps {
  resolver: Resolver | null;
  onCancel?: () => void;
}

export function ResolverAssignmentForm({
  resolver,
  onCancel,
}: ResolverAssignmentFormProps) {
  const { data: departments } = useGetDepartmentsQuery();
  const { data: services } = useGetServicesQuery();
  const [assign, { isLoading }] = useAssignJobToResolverMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department_ids: [],
      service_ids: [],
    },
  });

  useEffect(() => {
    if (resolver) {
      const assignedDepts = resolver.departments
        ? departments
            ?.filter((dept) => resolver.departments?.includes(dept.deptt_name))
            .map((dept) => dept.deptt_id) || []
        : [];

      const assignedServices = resolver.services
        ? services
            ?.filter((svc) => resolver.services?.includes(svc.service_name))
            .map((svc) => svc.service_id) || []
        : [];

      form.reset({
        department_ids: assignedDepts,
        service_ids: assignedServices,
      });
    }
  }, [resolver, departments, services, form]);

  async function onSubmit(data: FormData) {
    if (!resolver) return;

    try {
      await assign({
        resolverId: resolver.user_id,
        department_ids: data.department_ids,
        service_ids: data.service_ids,
      }).unwrap();

      toast.success("Role updated successfully!", {
        style: {
          "--normal-bg":
            "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
          "--normal-text":
            "light-dark(var(--color-green-600), var(--color-green-400))",
          "--normal-border":
            "light-dark(var(--color-green-600), var(--color-green-400))",
        } as React.CSSProperties,
      });
      onCancel?.();
    } catch (error: any) {
      const msg = error?.data?.message || "Failed to assign responsibilities.";
      toast.error(msg, {
        style: {
          "--normal-bg":
            "color-mix(in oklab, var(--destructive) 10%, var(--background))",
          "--normal-text": "var(--destructive)",
          "--normal-border": "var(--destructive)",
        } as React.CSSProperties,
        closeButton: true,
      });
    }
  }

  if (!resolver) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Responsibilities</CardTitle>
        <CardDescription>
          Assign departments and services to {resolver.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="department_ids"
              render={() => (
                <FormItem>
                  <FormLabel>Departments</FormLabel>
                  <div className="space-y-3">
                    {departments?.map((dept) => (
                      <FormField
                        key={dept.deptt_id}
                        control={form.control}
                        name="department_ids"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(dept.deptt_id)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), dept.deptt_id]
                                    : (field.value || []).filter(
                                        (id) => id !== dept.deptt_id
                                      );
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {dept.deptt_name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service_ids"
              render={() => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <div className="space-y-3">
                    {services?.map((service) => (
                      <FormField
                        key={service.service_id}
                        control={form.control}
                        name="service_ids"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(
                                  service.service_id
                                )}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), service.service_id]
                                    : (field.value || []).filter(
                                        (id) => id !== service.service_id
                                      );
                                  field.onChange(updatedValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {service.service_name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Assignments
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 size-4" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
