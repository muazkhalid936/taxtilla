import { STATUS_MAPPINGS } from "@/constants";
import { ColumnDef } from "@tanstack/react-table";

export interface Inquiry {
  _id: string;
  // Customer-specific fields
  quantity?: number;
  quantityType?: string;
  proposalsReceived?: number;
  delay?: number;
  createdAt?: string;
  status?: string;
  // Supplier-specific fields:
  customerId?: {
    _id: string;
    name: string;
  };
  po?: number;
  specifications?: string;
  deliveryStartDate?: string;
  deliveryEndDate?: string;
  paymentTerms?: {
    paymentMode: string;
    paymentDays: number;
    shipmentTerms: string;
    businessCondition: string;
  };
}

export const baseColumns: ColumnDef<Inquiry>[] = [
  {
    id: "delay",
    header: "Aging/Delay",
    cell: ({ row }) => row.original.delay ?? "-",
  },
  {
    accessorKey: "status",
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
    cell: () => (
      <div className="space-x-2">
        <button className="text-blue-600 underline">Chat</button>
      </div>
    ),
  },
];

export const getCustomerColumns = (): ColumnDef<Inquiry>[] => {
  return [
    {
      id: "sr",
      header: "Sr.",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "po",
      header: "PO",
    },
    {
      id: "specs",
      header: "Specs",
      cell: ({ row }) => {
        const specs = row.original.specifications ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
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
      id: "postingDate",
      header: "Inquiry Posting Date",
      cell: ({ row }) => {
        const dt = row.original.createdAt;
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
      id: "proposalsReceived",
      header: "Proposals Received",
      cell: ({ row }) => row.original.proposalsReceived ?? 0,
    },
    // Merge in the common columns
    ...baseColumns,
  ];
};

export const getSupplierColumns = (): ColumnDef<Inquiry>[] => {
  return [
    {
      id: "sr",
      header: "Sr.",
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => row.original.customerId?.name ?? "-",
    },
    {
      id: "po",
      header: "PO",
      cell: ({ row }) => row.original.po ?? "-",
    },
    {
      id: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const qty = row.original.quantity ?? 0;
        const qtyType = row.original.quantityType ?? "";
        return `${qty} ${qtyType}`;
      },
    },
    {
      id: "specifications",
      header: "Specifications",
      cell: ({ row }) => {
        const specs = row.original.specifications ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "deliveryStartDate",
      header: "Start Date",
      cell: ({ row }) =>
        row.original.deliveryStartDate
          ? new Date(row.original.deliveryStartDate).toLocaleDateString()
          : "-",
    },
    {
      id: "deliveryEndDate",
      header: "End Date",
      cell: ({ row }) =>
        row.original.deliveryEndDate
          ? new Date(row.original.deliveryEndDate).toLocaleDateString()
          : "-",
    },
    {
      id: "paymentTerms",
      header: "Payment Terms",
      cell: ({ row }) => {
        const terms = row.original.paymentTerms;
        return terms ? `${terms.paymentMode} - ${terms.paymentDays} days` : "-";
      },
    },
    {
      id: "shipmentTerms",
      header: "Shipment Terms",
      cell: ({ row }) => row.original.paymentTerms?.shipmentTerms ?? "-",
    },
    {
      id: "businessCondition",
      header: "Business Condition",
      cell: ({ row }) => row.original.paymentTerms?.businessCondition ?? "-",
    },
    // Merge in the common columns
    ...baseColumns,
  ];
};
