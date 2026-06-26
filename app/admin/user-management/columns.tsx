'use client';

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Clock, CheckCircle2, UserCog } from "lucide-react";

export type User = {
  id: string;
  fullName: string;
  email: string;
  ministry: string | null;
  role: string;
  approved: boolean;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: "User Name",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.getValue("fullName")}
      </div>
    ),
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-gray-500">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    accessorKey: "approved",
    header: "Application Status",
    cell: ({ row }) => {
      const approved = row.getValue("approved") as boolean;

      return approved ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 size={12} />
          Approved
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border bg-orange-50 text-orange-700 border-orange-200">
          <Clock size={12} />
          Pending
        </span>
      );
    },
  },
  {
    accessorKey: "ministry",
    header: "Assigned Ministry",
    cell: ({ row }) => {
      const ministry = row.getValue("ministry") as string | null;

      return ministry ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {ministry}
        </span>
      ) : (
        <span className="text-gray-400 italic">
          None
        </span>
      );
    },
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;

      return (
        <span className="capitalize font-medium text-gray-700">
          {role}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original;

      return (
        <button
          onClick={(e) => {
            e.stopPropagation();

            (
              table.options.meta as {
                openUserModal: (user: User) => void;
              }
            ).openUserModal(user);
          }}
          className="inline-flex items-center gap-1.5 bg-[#0060AF] hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          Manage
          <UserCog size={14} />
        </button>
      );
    },
  },
];