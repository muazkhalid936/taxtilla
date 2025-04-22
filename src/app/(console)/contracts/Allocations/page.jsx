"use client";

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
import InputBox from "../../../../components/common/InputBox";

const data = [
  {
    allocNo: 112233,
    allocDate: "10-Jun-24",
    specs: "10-Jun-24",
    coneWt: 130,
    sNo: 260000,
    qty: 338000,
    rate: 3988400,
    dlvryStartDate: 3988400,
    dlvryEndDate: 3988400,
  },
  {
    allocNo: 112234,
    allocDate: "11-Jun-24",
    specs: "11-Jun-24",
    coneWt: 140,
    sNo: 270000,
    qty: 339000,
    rate: 3988500,
    dlvryStartDate: 3988500,
    dlvryEndDate: 3988500,
  },
  {
    allocNo: 112235,
    allocDate: "12-Jun-24",
    specs: "12-Jun-24",
    coneWt: 150,
    sNo: 280000,
    qty: 340000,
    rate: 3988600,
    dlvryStartDate: 3988600,
    dlvryEndDate: 3988600,
  },
];

const columns = [
  {
    accessorKey: "allocNo",
    header: "Alloc No.",
  },
  {
    accessorKey: "allocDate",
    header: "Alloc Date",
  },
  {
    accessorKey: "specs",
    header: "Specs",
  },
  {
    accessorKey: "coneWt",
    header: "Cone wt",
  },
  {
    accessorKey: "sNo",
    header: "S/O No.",
  },
  {
    accessorKey: "qty",
    header: "Qty",
  },
  {
    accessorKey: "rate",
    header: "Rate",
  },
  {
    accessorKey: "dlvryStartDate",
    header: "DLVRY Start Date",
  },
  {
    accessorKey: "dlvryEndDate",
    header: "DLVRY End Date",
  },
];

const page = () => {
  const [sorting, setSorting] = React.useState ([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <>
      <div>Allocations Details</div>

      <div className="flex gap-5 mt-10 ">
        <InputBox title={"Contract No."} placeholder={"Enter here"}  />
        <InputBox title={"Contract Date"} placeholder={"Enter here"} />
      </div>
      <div className="flex gap-5 ">
        <InputBox title={"Customer"} placeholder={"Enter here"} />
        <InputBox title={"Total Qty"} placeholder={"Enter here"} />
      </div>
      <div className="flex gap-5 ">
        <InputBox title={"Allocated"} placeholder={"Specification"} />
        <InputBox title={"Balance"} placeholder={"Specification"} />
      </div>

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
    </>
  );
};

export default page;

