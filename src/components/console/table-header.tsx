"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";

/**
 * HeadCell type, matching your old code:
 */
interface HeadCell {
  id: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: number | string;
  minWidth?: number | string;
  colSpan?: number;
}

/**
 * Props:
 * - order: "asc" or "desc"
 * - orderBy: which column is sorted
 * - rowCount: total number of rows
 * - headLabel: array of HeadCell
 * - checkBox?: boolean
 * - numSelected?: number
 * - onRequestSort?: (property: string) => void
 * - onSelectAllClick?: ...
 */
interface TableHeaderProps {
  order?: "asc" | "desc";
  orderBy?: string;
  rowCount?: number;
  headLabel: HeadCell[];
  checkBox?: boolean;
  numSelected?: number;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRequestSort?: (property: string) => void;
  onSelectAllClick?: () => void;
}

export default function CustomTableHeader({
  order = "asc",
  orderBy = "",
  rowCount = 0,
  headLabel,
  checkBox = false,
  numSelected = 0,
  onRequestSort,
  onSelectAllClick,
}: TableHeaderProps) {
  function handleSort(id: string) {
    if (onRequestSort) onRequestSort(id);
  }

  return (
    <TableHead className="bg-muted">
      <TableRow>
        {checkBox && (
          <TableCell className="p-2">
            <Checkbox
              checked={rowCount > 0 && numSelected === rowCount}
              onCheckedChange={onSelectAllClick}
            />
          </TableCell>
        )}

        {headLabel.map((cell) => {
          const isActive = orderBy === cell.id;
          return (
            <TableCell
              key={cell.id}
              className="whitespace-nowrap"
              style={{
                width: cell.width,
                minWidth: cell.minWidth,
              }}
              colSpan={cell.colSpan || 1}
            >
              {/* sort label */}
              {onRequestSort ? (
                <button
                  type="button"
                  onClick={() => handleSort(cell.id)}
                  className="group inline-flex items-center space-x-1 bg-transparent p-0 text-sm font-medium"
                >
                  <span>{cell.label}</span>
                  {/* Indicate sort direction if active */}
                  {isActive && (
                    <span className="text-xs text-muted-foreground">
                      {order === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </button>
              ) : (
                <span className="text-sm font-medium">{cell.label}</span>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
