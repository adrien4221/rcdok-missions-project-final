"use client"

import { ColumnDef } from "@tanstack/react-table"

import { ArrowUpDown } from "lucide-react"

import { MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Request = {
  id: string
  name: string
  contact: string
  ministry: "Nutrition Ministry" | " Civil Registry Ministry" | 
  "Justice Ministry" | "Mental Health Ministry" | "Drug Rehabilitation Ministry" | 
  "Community Ministry"
  parish: string
  date_requested: string
  status: "Pending" | "Completed" | "Failed"
}

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "contact",
    header: "Contact No.",
  },
  {
    accessorKey: "ministry",
    header: "Ministry",
  },
  {
    accessorKey: "parish",
    header: "Parish",
  },
  {
    accessorKey: "date_requested",
    header:"Date Requested",
  }, 
  {
    accessorKey: "status",
    header: "Status",
  },
  
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Updates Status to Completed</DropdownMenuItem>
            <DropdownMenuItem>Update Status to Failed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]