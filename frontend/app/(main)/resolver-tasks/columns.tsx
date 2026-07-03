"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ResolverTask } from "@/lib/features/resolver-api"

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-yellow-500/10", text: "text-yellow-700 dark:text-yellow-400" },
  "IN PROGRESS": { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400" },
  RESOLVED: { bg: "bg-green-500/10", text: "text-green-700 dark:text-green-400" },
}


export const createColumns = (
  onResolve: (complaint: ResolverTask) => void,
): ColumnDef<ResolverTask>[] => [
  {
    accessorKey: "complaint_id",
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
    cell: ({ row }) => <span className="font-medium">{row.getValue("complaint_id")}</span>,
  },
  {
    accessorKey: "complaint_detail",
    header: "Details",
    cell: ({ row }) => {
      const detail = row.getValue("complaint_detail") as string
      return <p className="max-w-[300px] truncate">{detail}</p>
    },
  },
  {
    accessorKey: "deptt_name",
    header: "Department",
  },
  {
    accessorKey: "service_name",
    header: "Service",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const colors = statusColors[status] || statusColors.PENDING
      return <span className={`${colors.bg} ${colors.text} px-2 py-1 rounded-full text-xs font-medium`}>{status}</span>
    },
  },
  {
    accessorKey: "complaint_by",
    header: "Complaint By",
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string)
      return <span className="text-sm text-muted-foreground">{date.toLocaleDateString()}</span>
    },
  },
  {
    accessorKey: "action",
    header: "Created",
    cell: ({ row }) => {
      return <Button variant="default" onClick={()=>onResolve(row.original)}>Resolved</Button>
    },
  },
]
