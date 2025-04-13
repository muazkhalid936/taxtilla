import React from "react";
import {
  flexRender,
  getCoreRowModel,
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

export default function Modal({
  isOpen,
  onClose,
  title,
  data,
  columns,
  modalType,
}) {
  if (!isOpen) return null;

  const filteredColumns = columns.filter((column) =>
    column.modalType?.includes(modalType)
  );
  console.log(modalType, columns);
  const table = useReactTable({
    data,
    columns: filteredColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-10 backdrop-blur-sm bg-opacity-50">
      <div className="bg-white w-[70vw] p-6 rounded-lg shadow-lg">
        <p className="font-bold">{title}</p>

        <Table className="mt-10">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  colSpan={filteredColumns.length}
                  className="text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-white border rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>

          {modalType != "dispatch" && (
            <>
              <button
                onClick={onClose}
                className="px-8 py-2 bg-black text-white rounded-lg transition"
              >
                Update
              </button>

              <button
                onClick={onClose}
                className="px-8 py-2 bg-black text-white rounded-lg transition"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

