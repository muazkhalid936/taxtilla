import { STATUS_MAPPINGS } from "@/constants";
import { ColumnDef } from "@tanstack/react-table";

export interface BBInquiry {
  _id: string;
  customerId?: {
    _id: string;
    name: string;
  };
  baseCount?: number;
  quantity?: number;
  quantityType?: string;
  proposalsReceived?: number;
  aging?: number;
  deliveryStartDate?: string;
  deliveryEndDate?: string;
  status?: string;
}

/**
 * Base columns common for the supplier view.
 * These columns include:
 * - ID, Base Count, Quantity, Contract End Date, Aging/aging, Status, Action
 */
export const bbInquirySupplierBaseColumns: ColumnDef<BBInquiry>[] = [
  {
    id: "baseCount",
    header: "Base Count",
    cell: ({ row }) => row.original.baseCount ?? "-",
  },
  {
    id: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const qty = row.original.quantity ?? 0;
      const qtyType = row.original.quantityType ?? "";
      return `${qty} (${qtyType})`;
    },
  },
  {
    id: "endDate",
    header: "Contract End Date",
    cell: ({ row }) => {
      const dt = row.original.deliveryEndDate;
      if (!dt) return "-";
      return new Date(dt).toLocaleString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    },
  },
  {
    id: "aging",
    header: "Aging/aging",
    cell: ({ row }) => row.original.aging ?? 0,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status ?? "";
      const userType = localStorage.getItem(
        "user_type"
      ) as keyof typeof STATUS_MAPPINGS;
      const statusMap = STATUS_MAPPINGS[userType] || {};
      return (statusMap as Record<string, string>)[status] ?? "-";
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="space-x-2">
        <button className="text-blue-600 underline">Chat</button>
      </div>
    ),
  },
];

export const getBBInquiryCustomerColumns = (): ColumnDef<BBInquiry>[] => {
  return [
    {
      id: "sr",
      header: "Sr.",
      cell: ({ row }) => row.index + 1,
    },
    // Use the first four supplier base columns: ID, Base Count, Quantity, Contract End Date.
    ...bbInquirySupplierBaseColumns.slice(0, 4),
    {
      id: "proposalsReceived",
      header: "Proposals Received",
      cell: ({ row }) => row.original.proposalsReceived ?? 0,
    },
    // Append the remaining supplier base columns: Aging/aging, Status, Action.
    ...bbInquirySupplierBaseColumns.slice(4),
  ];
};

/**
 * Supplier-specific columns for BB Inquiries.
 * These are based directly on the common supplier base columns.
 */
export const getBBInquirySupplierColumns = (): ColumnDef<BBInquiry>[] => {
  return [
    {
      id: "sr",
      header: "Sr.",
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "customerId",
      header: "Customer",
      cell: ({ row }) => row.original.customerId?.name ?? "-",
    },
    ...bbInquirySupplierBaseColumns.slice(0, 2),
    {
      id: "deliveryStartDate",
      header: "Delivery Start Date",
      cell: ({ row }) => row.original.deliveryStartDate ?? "-",
    },
    ...bbInquirySupplierBaseColumns.slice(3),
  ];
};
