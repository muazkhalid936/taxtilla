import { STATUS_MAPPINGS } from "@/constants";

export const baseColumns = [
  // {
  //   id: "delay",
  //   header: "Aging/Delay",
  //   cell: ({ row }) => row.original.delay ?? "-",
  // },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const status = row.original.status ?? "";
  //     const userType = localStorage.getItem("user_type");
  //     const statusMap = STATUS_MAPPINGS[userType] || {};
  //     return statusMap[status] ?? "-";
  //   },
  // },
  {
    id: "actions",
    header: "Action",
    cell: () => (
      <div className="space-x-2">
        <button className="text-blue-600 underline">View</button>
      </div>
    ),
  },
];

export const getSupplierColumns = () => {
  return [
    {
      id: "sr",
      header: "Sr.",
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "ID",
      header: "ID",
      cell: ({ row }) => row.original._id ?? "-",
    },
    {
      id: "po",
      header: "PO",
      cell: ({ row }) => row.original.poNumber ?? "-",
    },
    {
      id: "So",
      header: "SO",
      cell: ({ row }) => {
        const qty = row.original.soNumber ?? 0;
        const qtyType = row.original.quantityType ?? "";
        return `${qty} ${qtyType}`;
      },
    },
    {
      id: "specifications",
      header: "Contract No",
      cell: ({ row }) => {
        const specs = row.original.contractNumber ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "specs",
      header: "Specs",
      cell: ({ row }) => {
        const specs = row.original.specs ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "conewt",
      header: "Cone wt",
      cell: ({ row }) => {
        const specs = row.original.coneWeight?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "supplier",
      header: "Supplier",
      cell: ({ row }) => {
        const specs = row.original.supplierId.name ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "rate",
      header: "Rate",
      cell: ({ row }) => {
        const specs = row.original.rate ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },    {
      id: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const specs = row.original.quantity ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },    {
      id: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const specs = row.original.balance ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "stock",
      header: "Stock",
      cell: ({ row }) => row.original.stock ?? "-",
    },
    {
      id: "disReq",
      header: "Dispatch Requirement",
      cell: ({ row }) => row.original.dispatch ?? "-",
    },
    {
      id: "deliveryStartDate",
      header: "Start Date",
      // cell: ({ row }) => row.original.startDate ?? "-",

      cell: ({ row }) =>
        row.original.startDate
          ? new Date(row.original.startDate).toLocaleDateString()
          : "-",
    },
    {
      id: "deliveryEndDate",
      header: "End Date",
      cell: ({ row }) =>
        row.original.startDate
          ? new Date(row.original.endDate).toLocaleDateString()
          : "-",
    },
    {
      id: "paymentTerms",
      header: "SO Document",
      cell: ({ row }) => row.original.soDocument ?? "-",

      // cell: ({ row }) => {
      //   const terms = row.original.SODocument;
      //   return terms ? `${terms.paymentMode} - ${terms.paymentDays} days` : "-";
      // },
    },
    {
      id: "shipmentTerms",
      header: "Aging",
      cell: ({ row }) => row.original.aging ?? "-",
    },
    {
      id: "businessCondition",
      header: "Status",
      cell: ({ row }) => row.original.status ?? "-",
    },
    {
      id: "payStatus",
      header: "Pay Status",
      cell: ({ row }) => row.original.payStatus ?? "-",
    },
    ...baseColumns,
  ];
};

export const getCustomerColumns = () => {
  return [
    {
      id: "sr",
      header: "Sr.",
      cell: ({ row }) => row.index + 1,
    },
    {
      id: "ID",
      header: "ID",
      cell: ({ row }) => row.original.id ?? "-",
    },
    {
      id: "po",
      header: "PO",
      cell: ({ row }) => row.original.po ?? "-",
    },
    {
      id: "So",
      header: "SO",
      cell: ({ row }) => {
        const qty = row.original.so ?? 0;
        const qtyType = row.original.quantityType ?? "";
        return `${qty} ${qtyType}`;
      },
    },
    {
      id: "specifications",
      header: "Contact No",
      cell: ({ row }) => {
        const specs = row.original.contractNo ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "specs",
      header: "Specs",
      cell: ({ row }) => {
        const specs = row.original.specs ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "conewt",
      header: "Cone wt",
      cell: ({ row }) => row.original.coneWt ?? "-",

      // cell: ({ row }) => {
      //   const specs = row.original.coneWT ?? "";
      //   return specs.length > 50
      //     ? specs.substring(0, 50) + "..."
      //     : specs || "-";
      // },
    },
    {
      id: "supplier",
      header: "Supplier",
      cell: ({ row }) => {
        const specs = row.original.supplier ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "rate",
      header: "Rate",
      cell: ({ row }) => {
        const specs = row.original.rate ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },    {
      id: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const specs = row.original.quantity ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },    {
      id: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const specs = row.original.balance ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "stock",
      header: "Stock",
      cell: ({ row }) => row.original.stock ?? "-",
    },
    {
      id: "disReq",
      header: "Dispatch Requirement",
      cell: ({ row }) => row.original.dispatch ?? "-",
    },
    {
      id: "deliveryStartDate",
      header: "Start Date",
      cell: ({ row }) => row.original.startDate ?? "-",

      // cell: ({ row }) =>
      //   row.original.StartDate
      //     ? new Date(row.original.deliveryStartDate).toLocaleDateString()
      //     : "-",
    },
    {
      id: "deliveryEndDate",
      header: "End Date",
      cell: ({ row }) => row.original.endDate ?? "-",

      // cell: ({ row }) =>
      //   row.original.EndDate
      //     ? new Date(row.original.deliveryEndDate).toLocaleDateString()
      //     : "-",
    },
    {
      id: "paymentTerms",
      header: "SO Document",
      cell: ({ row }) => row.original.soDocument ?? "-",

      // cell: ({ row }) => {
      //   const terms = row.original.SODocument;
      //   return terms ? `${terms.paymentMode} - ${terms.paymentDays} days` : "-";
      // },
    },
    {
      id: "shipmentTerms",
      header: "Aging",
      cell: ({ row }) => row.original.agingDelay ?? "-",
    },
    {
      id: "businessCondition",
      header: "Status",
      cell: ({ row }) => row.original.status ?? "-",
    },
    {
      id: "payStatus",
      header: "Pay Status",
      cell: ({ row }) => row.original.payStatus ?? "-",
    },
    ...baseColumns,
  ];
};

