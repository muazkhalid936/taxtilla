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
import InputBox from "@/components/common/InputBox";

const page = () => {
  const data = Array.from({ length: 4 }).map(() => ({
    date: "12-09-24",

    qty: "100",
    qty2: "100",
    qty3: "100",
  }));

  const columns = [
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "qty",
      header: "Quantity",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "qty2",
      header: "Quantity",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "qty3",
      header: "Quantity",
      cell: (info) => info.getValue(),
    },
  ];

  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      {/* Date Range Section */}
      <div className="flex justify-end gap-4 items-center">
        <p className="text-[14px] underline">Select Date Range</p>
        <InputBox
          title={"Start Date"}
          placeholder={"Enter here"}
          smallWidth={true}
          type={"date"}
        />
        <InputBox
          title={"End Date"}
          placeholder={"Enter here"}
          smallWidth={true}
          type={"date"}
        />
      </div>

      {/* Four Columns Section */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="border rounded-md p-4 flex flex-col gap-1">
          <h2 className="text-center font-bold mb-4">SUPPLIER NAME</h2>
          <InputBox title={"ID"} placeholder={"Enter here"} smallWidth={"20vw"} />
          <InputBox title={"PO"} placeholder={"Enter here"}smallWidth={"20vw"} />

          <InputBox title={"Stock In Hand"} placeholder={"400"}smallWidth={"20vw"} />
          <InputBox title={"Balance"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"SO"} placeholder={"400"} smallWidth={"20vw"}/>

          <InputBox title={"Spec"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"Cone. WT"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"TOTAL REQUESTED QTY"} placeholder={"400"}smallWidth={"20vw"} />
        </div>
        <div className="border rounded-md p-4 flex flex-col gap-1">
          <h2 className="text-center font-bold mb-4">SUPPLIER NAME</h2>
          <InputBox title={"ID"} placeholder={"Enter here"} smallWidth={"20vw"}/>
          <InputBox title={"PO"} placeholder={"Enter here"} smallWidth={"20vw"}/>

          <InputBox title={"Stock In Hand"} placeholder={"400"}smallWidth={"20vw"} />
          <InputBox title={"Balance"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"SO"} placeholder={"400"}smallWidth={"20vw"} />

          <InputBox title={"Spec"} placeholder={"SPECIFICATION"} smallWidth={"20vw"}/>
          <InputBox title={"Cone. WT"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"TOTAL REQUESTED QTY"} placeholder={"400"}smallWidth={"20vw"} />
        </div>
        <div className="border rounded-md p-4 flex flex-col gap-1">
          <h2 className="text-center font-bold mb-4">SUPPLIER NAME</h2>
          <InputBox title={"ID"} placeholder={"Enter here"}smallWidth={"20vw"} />
          <InputBox title={"PO"} placeholder={"Enter here"}smallWidth={"20vw"}/>

          <InputBox title={"Stock In Hand"} placeholder={"400"}smallWidth={"20vw"} />
          <InputBox title={"Balance"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"SO"} placeholder={"400"}smallWidth={"20vw"} />

          <InputBox title={"Spec"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"Cone. WT"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"TOTAL REQUESTED QTY"} placeholder={"400"} smallWidth={"20vw"}/>
        </div>
        <div className="border rounded-md p-4 flex flex-col gap-1">
          <h2 className="text-center font-bold mb-4">SUPPLIER NAME</h2>
          <InputBox title={"ID"} placeholder={"Enter here"}smallWidth={"20vw"} />
          <InputBox title={"PO"} placeholder={"Enter here"}smallWidth={"20vw"} />

          <InputBox title={"Stock In Hand"} placeholder={"400"} smallWidth={"20vw"}/>
          <InputBox title={"Balance"} placeholder={"SPECIFICATION"} smallWidth={"20vw"}/>
          <InputBox title={"SO"} placeholder={"400"}smallWidth={"20vw"} />

          <InputBox title={"Spec"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"Cone. WT"} placeholder={"SPECIFICATION"}smallWidth={"20vw"} />
          <InputBox title={"TOTAL REQUESTED QTY"} placeholder={"400"}smallWidth={"20vw"} />
        </div>
      </div>

      <Table className="mt-10">
        <TableHeader className="bg-gray-200">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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


      <div className="flex justify-end items-center mt-4 ">
        <button className="bg-black ml-auto rounded-md text-white px-4 py-2 mt-4">
          <p className="text-sm">Send</p>
        </button>
      </div>
    </div>
  );
};

export default page;

