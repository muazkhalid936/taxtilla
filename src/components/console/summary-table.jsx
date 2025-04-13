"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * A flexible, reusable SummaryTable in Next.js + shadcn/ui.
 * Props:
 * - columns: array of column definitions { id, header, render? }
 * - data: array of row objects
 * - maxWidth: optional max width (default: 200px)
 * - className: optional tailwind classes
 */
export function SummaryTable({
  columns,
  data,
  maxWidth = 200,
  className = "",
}) {
  return (
    <div
      className={`mb-2 ml-auto overflow-auto rounded border ${className}`}
      style={{ maxWidth }}
    >
      <Table>
        {/* HEAD */}
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.id} className=" font-bold text-black">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => {
                const cellValue = col.render ? col.render(row) : row[col.id];
                return (
                  <TableCell key={col.id} className="whitespace-nowrap">
                    {cellValue}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

