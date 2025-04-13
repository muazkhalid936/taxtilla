import { ColumnDef } from "@tanstack/react-table";

export interface Proposal {
  _id: string;
  so: string;
  spec?: number;
  rate?: number;
  quantity?: string;
  sendDate?: number;
  delay?: number;
  status?: string;
}

export const baseColumns: ColumnDef<Proposal>[] = [
  {
    id: "delay",
    header: "Aging/Delay",
    cell: ({ row }) => row.original.delay ?? "-",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Action",
    cell: () => (
      <div className="space-x-2">
        <button className="text-blue-600 underline">Chat</button>
      </div>
    ),
  },
];

export const getCustomerColumns = (): ColumnDef<Proposal>[] => {
  return [
    {
      id: "sr",
      header: "Sr.",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "so",
      header: "S/O",
      cell: ({ row }) => row.original.so ?? 0,
    },
    {
      accessorKey: "spec",
      header: "Spec",
      cell: ({ row }) => row.original.spec ?? 0,
    },
    {
      accessorKey: "sendDate",
      header: "Send Date",
      cell: ({ row }) =>
        row.original.sendDate
          ? new Date(row.original.sendDate).toLocaleDateString()
          : "-",
    },
    {
      id: "quantity",
      header: "Quantity",
      cell: ({ row }) => row.original.quantity ?? 0,
    },
    // Merge in the common columns
    ...baseColumns,
  ];
};

export const getSupplierColumns = (): ColumnDef<Proposal>[] => {
  return [
    {
      id: "sr",
      header: "Sr.",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "so",
      header: "S/O",
      cell: ({ row }) => row.original.so ?? 0,
    },
    {
      accessorKey: "spec",
      header: "Spec",
      cell: ({ row }) => row.original.spec ?? 0,
    },
    {
      accessorKey: "sendDate",
      header: "Send Date",
      cell: ({ row }) =>
        row.original.sendDate
          ? new Date(row.original.sendDate).toLocaleDateString()
          : "-",
    },
    {
      id: "quantity",
      header: "Quantity",
      cell: ({ row }) => row.original.quantity ?? 0,
    },

    ...baseColumns,
  ];
};
