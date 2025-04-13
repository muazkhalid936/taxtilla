"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
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

import { ScrollArea, ScrollBar } from "../ui/scroll-area";

/**
 * A generic table interface for your row data.
 * You can define it more strictly if you want, or keep it generic.
 */
interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
}

/**
 * A reusable DataTable component using TanStack Table + shadcn/ui styling.
 * - columns: array of ColumnDef
 * - data: array of row objects
 */
export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Create the TanStack Table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    // If you want sorting:
    // getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full overflow-auto rounded border">
      <ScrollArea className="w-full max-w-[80vw] mx-auto">
        <div className="overflow-x-auto mb-4">
          <Table>
            {/* Table header */}
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isSortable = !!header.column.getCanSort();
                    const sortDir = header.column.getIsSorted() as
                      | "asc"
                      | "desc"
                      | false;
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
                        {isSortable ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="group inline-flex items-center space-x-1"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {sortDir === "asc" && <span>▲</span>}
                            {sortDir === "desc" && <span>▼</span>}
                          </button>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            {/* Table body */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
