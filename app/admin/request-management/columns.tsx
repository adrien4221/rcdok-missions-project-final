'use client';

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";

// define the TypeScript shape 
export type Request = {
  id: string;
  name: string;
  contact: string;
  ministry: string;
  parish: string;
  date_requested: string;
  status: string;
  serviceId: string; 
  details: string; // for additional info or message from the requester
};

// define the Columns
export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "date_requested",
    header: "Date",
    cell: ({ row }) => <div className="text-gray-500 whitespace-nowrap">{row.getValue("date_requested")}</div>,
  },
  {
    accessorKey: "name",
    header: "Requester Name",
    cell: ({ row }) => <div className="font-medium text-gray-900">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "contact",
    header: "Contact Info",
    cell: ({ row }) => <div className="text-gray-500">{row.getValue("contact")}</div>,
  },
  {
    accessorKey: "ministry",
    header: "Requested Ministry",
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
        {row.getValue("ministry")}
      </span>
    ),
  },
  {
    accessorKey: "parish",
    header: "Parish / Station",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isPending = status.toLowerCase() === 'pending';
      
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
          isPending 
            ? 'bg-orange-50 text-orange-700 border-orange-200' 
            : 'bg-green-50 text-green-700 border-green-200'
        }`}>
          {isPending ? <Clock size={12} /> : <CheckCircle2 size={12} />}
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original;

      // Only show the "Process" button if it's pending!
      if (request.status.toLowerCase() !== 'pending') {
        return <span className="text-gray-400 text-sm italic">Processed</span>;
      }

      // dispatcher url with query params to pre-fill the form
      const queryParams = new URLSearchParams({
        clientName: request.name,
        contactNumber: request.contact,
        reason: request.details
      }).toString();

      return (
        <Link
          href={`/admin/ministries/${request.serviceId}/submit?${queryParams}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 bg-[#0060AF] hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          Process <ArrowRight size={14} />
        </Link>
      );
    },
  },
];