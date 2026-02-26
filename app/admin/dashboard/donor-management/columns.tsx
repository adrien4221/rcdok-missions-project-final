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

export type Payment = {
  id: string
  donor_name: string
  contact: string
  donation_type: "Monetary" | "Non-Cash"
  amount: string
  ministry: "Nutrition Ministry" | " Civil Registry Ministry" | 
  "Justice Ministry" | "Mental Health Ministry" | "Drug Rehabilitation Ministry" | 
  "Community Ministry"
  date_received: string
  status: "Pending" | "Completed" | "Failed"
}

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "donor_name",
    header: "Donor Name",
  },
  {
    accessorKey: "contact",
    header: "Contact No.",
  },
  {
    accessorKey: "donation_type",
    header: "Type",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "ministry",
    header: "Ministry",
  },
  {
    accessorKey: "date_received",
    header:"Date Received",
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