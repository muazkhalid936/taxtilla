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
      header: "User Id",
      cell: ({ row }) => row.original.customerId._id ?? "-",
    },
    {
      id: "po",
      header: "User Name",
      cell: ({ row }) => row.original.poNumber ?? "-",
    },
    {
      id: "So",
      header: "Designation",
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
      header: "Email",
      cell: ({ row }) => {
        const specs = row.original.specs ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "conewt",
      header: "Department",
      cell: ({ row }) => {
        const specs = row.original.coneWeight ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "customer",
      header: "Password",
      cell: ({ row }) => {
        const specs = row.original.customerName ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "rate",
      header: "Assign Suppliers",
      cell: ({ row }) => {
        const specs = row.original.rate ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
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
      header: "User Id",
      cell: ({ row }) => row.original.customerId._id ?? "-",
    },
    {
      id: "po",
      header: "User Name",
      cell: ({ row }) => row.original.poNumber ?? "-",
    },
    {
      id: "So",
      header: "Designation",
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
      header: "Email",
      cell: ({ row }) => {
        const specs = row.original.specs ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "conewt",
      header: "Department",
      cell: ({ row }) => {
        const specs = row.original.coneWeight ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "customer",
      header: "Password",
      cell: ({ row }) => {
        const specs = row.original.customerName ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },
    {
      id: "rate",
      header: "Assign Suppliers",
      cell: ({ row }) => {
        const specs = row.original.rate ?? "";
        return specs.length > 50
          ? specs.substring(0, 50) + "..."
          : specs || "-";
      },
    },

    ...baseColumns,
  ];
};

