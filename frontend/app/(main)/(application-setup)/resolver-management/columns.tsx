"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Resolver } from "@/lib/features/resolver-api"

export function createColumns(
  onEdit: (resolver: Resolver) => void,
  onDelete: (resolver: Resolver) => void,
): ColumnDef<Resolver>[] {
  return [
    {
      accessorKey: "user_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-semibold"
        >
          ID
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue("user_id")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 h-auto font-semibold"
        >
          Name
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "departments",
      header: "Departments",
      cell: ({ row }) => {
        const departments = row.getValue("departments") as string | null
        return departments ? (
          <div className="flex flex-wrap gap-1">
            {departments.split(", ").map((dept) => (
              <span key={dept} className="bg-secondary/50 px-2 py-1 rounded text-xs">
                {dept}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">None</span>
        )
      },
    },
    {
      accessorKey: "services",
      header: "Services",
      cell: ({ row }) => {
        const services = row.getValue("services") as string | null
        return services ? (
          <div className="flex flex-wrap gap-1">
            {services.split(", ").map((service) => (
              <span key={service} className="bg-primary/10 px-2 py-1 rounded text-xs text-primary">
                {service}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">None</span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const resolver = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(resolver)} className="cursor-pointer flex items-center gap-2">
                <Pencil className="size-3" />
                Assign
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(resolver)}
                className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
              >
                <Trash2 className="size-3" />
                Remove Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
