"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  approveUser,
  deleteUser,
  updateUser,
} from '@/app/actions/actions';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const [selectedUser, setSelectedUser] =
    React.useState<any | null>(null);

  const [editedRole, setEditedRole] = React.useState("");
  const [editedServiceId, setEditedServiceId] = React.useState("");

  const ministryOptions = [
    {
      id: "17b9bee1-9041-4d03-86a6-1edae4c1bae5",
      name: "Nutrition Ministry (Busog Puso)",
    },
    {
      id: "99823fae-b23d-4478-81fc-1e2c039be0ec",
      name: "Civil Registry Ministry",
    },
    {
      id: "f1fc9691-6882-4e32-8073-3d64a94bb1a2",
      name: "Justice Ministry",
    },
    {
      id: "0dfdf43c-819f-4020-aef3-5179b48ef44a",
      name: "Mental Health Ministry (Kaagapay)",
    },
    {
      id: "2ebdda8b-a4c2-4b6d-92c7-982d1c7d5f88",
      name: "Drug Rehabilitation Ministry (Salubong)",
    },
    {
      id: "ed983f8c-8919-4501-ab97-38dc118a4e9f",
      name: "Community Ministry (BEC)",
    },
  ];
  React.useEffect(() => {
    if (selectedUser) {
      setEditedRole(selectedUser.role);
      setEditedServiceId(selectedUser.serviceId || "");
    }
  }, [selectedUser]);

  const router = useRouter();

  const table = useReactTable({
    data,
    columns,

    meta: {
      openUserModal: (user: any) => {
        setSelectedUser(user);
      },
    },

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="relative">

      {/* Search */}
      <div className="flex items-center py-4 px-2">
        <Input
          placeholder="Search users..."
          value={
            (table
              .getColumn("fullName")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("fullName")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>

          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>

                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold uppercase text-gray-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}

              </TableRow>
            ))}
          </TableHeader>

          <TableBody>

            {table.getRowModel().rows?.length ? (

              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-50"
                >

                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}

                </TableRow>
              ))

            ) : (

              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>

            )}

          </TableBody>

        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4 px-2">

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>

      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">

              <h3 className="text-lg font-bold text-gray-900">
                User Details
              </h3>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Body */}
            <div className="p-6 space-y-6">

              <div className="grid grid-cols-2 gap-6">

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Full Name
                  </p>

                  <p className="font-semibold text-gray-900">
                    {selectedUser.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Email Address
                  </p>

                  <p className="font-semibold text-gray-900">
                    {selectedUser.email}
                  </p>
                </div>

                <div>
                <p className="text-sm text-gray-500 mb-2">
                  Role
                </p>

                <select
                  value={editedRole}
                  onChange={(e) => setEditedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Approval Status
                  </p>

                  {selectedUser.approved ? (
                    <span className="inline-flex px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-medium">
                      Pending
                    </span>
                  )}
                </div>

              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Assigned Ministry
                </p>

                <select
                  value={editedServiceId}
                  onChange={(e) => setEditedServiceId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">
                    No Ministry Assigned
                  </option>

                  {ministryOptions.map((service) => (
                    <option
                      key={service.id}
                      value={service.id}
                    >
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Admin Actions */}
              <div className="border-t pt-5">

                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Administrative Actions
                </p>

                <div className="flex flex-wrap gap-3">

                  {!selectedUser.approved && (
                    <button
                      onClick={async () => {
                        await approveUser(selectedUser.id);

                        setSelectedUser({
                          ...selectedUser,
                          approved: true,
                        });

                        router.refresh();
                      }}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
                    >
                      Approve User
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      const confirmed = confirm(
                        `Delete ${selectedUser.fullName}'s account request?`
                      );

                      if (!confirmed) return;

                      await deleteUser(selectedUser.id);
                      router.refresh();

                      setSelectedUser(null);

                      router.refresh();
                    }}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                  >
                    Remove User
                  </button>

                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">

              <button
                onClick={async () => {
                  await updateUser(
                    selectedUser.id,
                    editedRole,
                    editedServiceId
                  );

                  router.refresh();

                  setSelectedUser(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#0060AF] text-white hover:bg-blue-700"
              >
                Save & Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}