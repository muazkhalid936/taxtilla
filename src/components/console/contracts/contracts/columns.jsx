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
      cell: ({ row }) => row.original.customerId._id ?? "-",
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
        const specs = row.original.coneWeight ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const specs = row.original.customerName ?? "";
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
      cell: ({ row }) => row.original.SODocument ?? "-",

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
      cell: ({ row }) => row.original.ID ?? "-",
    },
    {
      id: "po",
      header: "PO",
      cell: ({ row }) => row.original.PO ?? "-",
    },
    {
      id: "So",
      header: "SO",
      cell: ({ row }) => {
        const qty = row.original.SO ?? 0;
        const qtyType = row.original.quantityType ?? "";
        return `${qty} ${qtyType}`;
      },
    },
    {
      id: "specifications",
      header: "Contact No",
      cell: ({ row }) => {
        const specs = row.original.ContractNo ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "specs",
      header: "Specs",
      cell: ({ row }) => {
        const specs = row.original.Specs ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "conewt",
      header: "Cone wt",
      cell: ({ row }) => {
        const specs = row.original.ConeWT ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const specs = row.original.Customer ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "rate",
      header: "Rate",
      cell: ({ row }) => {
        const specs = row.original.Rate ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },    {
      id: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const specs = row.original.Quantity ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },    {
      id: "balance",
      header: "Balance",
      cell: ({ row }) => {
        const specs = row.original.Balance ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "deliveryStartDate",
      header: "Start Date",
      cell: ({ row }) => row.original.StartDate ?? "-",

      // cell: ({ row }) =>
      //   row.original.StartDate
      //     ? new Date(row.original.deliveryStartDate).toLocaleDateString()
      //     : "-",
    },
    {
      id: "deliveryEndDate",
      header: "End Date",
      cell: ({ row }) => row.original.EndDate ?? "-",

      // cell: ({ row }) =>
      //   row.original.EndDate
      //     ? new Date(row.original.deliveryEndDate).toLocaleDateString()
      //     : "-",
    },
    {
      id: "paymentTerms",
      header: "SO Document",
      cell: ({ row }) => row.original.SODocument ?? "-",

      // cell: ({ row }) => {
      //   const terms = row.original.SODocument;
      //   return terms ? `${terms.paymentMode} - ${terms.paymentDays} days` : "-";
      // },
    },
    {
      id: "shipmentTerms",
      header: "Aging",
      cell: ({ row }) => row.original.Aging ?? "-",
    },
    {
      id: "businessCondition",
      header: "Status",
      cell: ({ row }) => row.original.Status ?? "-",
    },
    ...baseColumns,
  ];
};

