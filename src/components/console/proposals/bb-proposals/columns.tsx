import { ColumnDef } from "@tanstack/react-table";

export interface Proposal {
  _id: string;
  baseCount?: number;
  quantity?: number;
  endDate?: string;
  proposalsSent?: number;
  proposalsReceived?: number;
  status?: string;
  delay?: number;
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
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => row.original._id ?? 0,
    },
    {
      accessorKey: "baseCount",
      header: "Base Count",
      cell: ({ row }) => row.original.baseCount ?? 0,
    },
    {
      id: "quantity",
      header: "Quantity",
      cell: ({ row }) => row.original.quantity ?? 0,
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) =>
        row.original.endDate
          ? new Date(row.original.endDate).toLocaleDateString()
          : "-",
    },
    {
      id: "proposalsReceived",
      header: "Proposals Received",
      cell: ({ row }) => row.original.proposalsReceived ?? 0,
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
      accessorKey: "_id",
      header: "ID",
      cell: ({ row }) => row.original._id ?? 0,
    },
    {
      accessorKey: "baseCount",
      header: "Base Count",
      cell: ({ row }) => row.original.baseCount ?? 0,
    },
    {
      id: "quantity",
      header: "Quantity",
      cell: ({ row }) => row.original.quantity ?? 0,
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) =>
        row.original.endDate
          ? new Date(row.original.endDate).toLocaleDateString()
          : "-",
    },
    {
      id: "proposalsSent",
      header: "Proposals Sent",
      cell: ({ row }) => row.original.proposalsSent ?? 0,
    },

    ...baseColumns,
  ];
};
