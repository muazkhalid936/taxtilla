"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import { Trash2 } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import Modal from "@/components/console/contracts/Running/Modal"; 
import ContractsBlockView from "@/components/console/contracts/Block/ContractBlockView";
import ContractFilter from "@/components/console/contracts/contracts/ContractFilter";
import ContractsView from "@/components/console/contracts/contracts/ContractsView";
import ContractRunningView from "@/components/console/contracts/Running/ContractRunningView";
import FormTabs from "@/components/console/form-tabs";
import BlockBookingInquiriesFilter from "@/components/console/inquiries/block-booking-inquiries/block-booking-inquires-filter";
import BBInquiriesView from "@/components/console/inquiries/block-booking-inquiries/block-booking-inquires-view";
import NewInquiry from "@/components/console/inquiries/new-inquiry";
import BlockView from "@/components/console/contracts/completed/CompletedView"
import ContractNew from "@/components/console/contracts/New/ContractNewView";
export default function ContractPage() {
  const data = Array.from({ length: 10 }).map(() => ({
    so: "11 22 33 44",
    specs: "111 222 333 444",
    conewt: "12-09-24",
    customer: "Joh Doe",
    specs:"-",
    stock: "200",
    qty: "100",
    disptachReq: "20-2-2025",
    disptach: "20-2-2025",
    todayProduction: "12-09-24",
    remarks:"Accepted",
    uploadSo:"Document",
    soNumber:"11-2-2130"
  }));

  const columns = [
    {
      id: "select",
      modalType: ["dispatch", "stock", "upload"],
      header: () => "Sr.",
      cell: () => <Checkbox />,
    },
    {
      accessorKey: "so",
      header: "S/O",
      modalType: ["dispatch", "stock", ""],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "customer",
      modalType: ["dispatch","stock"],
      header: "Customer",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "specs",
      header: "Specs",
      modalType: ["dispatch", "stock", "upload"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "conewt",
      header: "Conewt",
      modalType: ["stock", "upload"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "qty",
    header: "Quantity",
      modalType: ["dispatch", "upload"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      modalType: ["dispatch", "stock", "upload"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "disptachReq",
      header: "Dispatch Req",
      modalType: ["dispatch"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "disptach",
      header: "Dispatch",
      modalType: ["dispatch"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "todayProduction",
      header: "Date",
      modalType: ["dispatch"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "todayProduction",
      header: "Today Production",
      modalType: ["stock", "upload"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "remarks",
      header: "Remarks",
      modalType: ["dispatch"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "soNumber",
      header: "S/O No.",
      modalType: ["upload"],
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "uploadSo",
      header: "Upload S/O",
      modalType: ["upload"],
      cell: (info) => info.getValue(),
    },
    {
      id: "actions",
      modalType: ["stock", "upload"],
      header: "Action",
      cell: () => (
        <button>
          <Trash2 className="w-4 h-4 text-muted-foreground" />
        </button>
      ),
    },
  ];

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [userType, setUserType] = React.useState(null);
  const [selectedInquiries, setSelectedInquiries] = React.useState([]);
  const [updateStock, setUpdateStock] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false); // State for modal
  const [title, setTitle] = React.useState("");
  const [modalType, setModalType] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    setUserType(localStorage.getItem("user_type"));
  }, []);

  function handleOpenFilter() {
    console.log("Filter button clicked");
    setFilterOpen(true);
  }

  function handleCloseFilter() {
    setFilterOpen(false);
  }

  function handleSendProposals() {
    console.log(
      "Send Proposals clicked. Selected Inquiries:",
      selectedInquiries
    );
    sessionStorage.setItem(
      "selectedInquiries",
      JSON.stringify(selectedInquiries)
    );
    router.push("/proposals/new/gn-proposal");
  }

  function handleUpdateStock() {
    setTitle("Update Stock");
    setModalType("stock");
    setIsModalOpen(!isModalOpen); // Toggle modal
  }
  function handleDispatch() {
    setModalType("dispatch");
    setTitle("Enter Dispatch ");
    setIsModalOpen(!isModalOpen); // Toggle modal
  }
  function handleSendProposals() {
    setModalType("upload");
    setTitle("Upload S/O ");
    setIsModalOpen(!isModalOpen); // Toggle modal
  }

  function handleCloseModal() {
    setIsModalOpen(false); // Close modal
  }

  const baseTabs = [
    {
      label: "All",
      component: (
        <ContractsView
          selectedInquiries={selectedInquiries}
          setSelectedInquiries={setSelectedInquiries}
        />
      ),
      otherButtons:
        userType === "supplier"
          ? [
              // {
              //   label: "Send Proposals",
              //   variant: "default",
              //   onClick: handleSendProposals,
              // },
            ]
          : [],
      filterComponent: (
        <ContractFilter
          open={filterOpen}
          onClose={handleCloseFilter}
          onSave={() => {}}
        />
      ),
    },
    {
      label: "Running",
      component: <ContractRunningView />,
      otherButtons:
        userType != "supplier"
          ? [
              {
                label: "Adv Payments",
                variant: "default",
                onClick: handleSendProposals,
              },
              {
                label: "Monthly Lifting",
                variant: "default",
                onClick: handleSendProposals,
              },
              {
                label: "Request D/O",
                variant: "default",
                onClick: handleSendProposals,
              },
            ]
          : [
              {
                label: "Dispatch",
                variant: "default",
                onClick: handleDispatch,
              },
              {
                label: "Updated Stock",
                variant: "default",
                onClick: handleUpdateStock, // Updated to open modal
              },
              {
                label: "Upload S/O",
                variant: "default",
                onClick: handleSendProposals,
              },
            ],
      filterComponent: (
        <BlockBookingInquiriesFilter
          open={filterOpen}
          onClose={handleCloseFilter}
        />
      ),
    },
    {
      label: "Block",
      component: <ContractsBlockView />,
      otherButtons:
        userType != "supplier"
          ? [
              {
                label: "Adv Payments",
                variant: "default",
                onClick: handleSendProposals,
              },
              {
                label: "Monthly Lifting",
                variant: "default",
                onClick: handleSendProposals,
              },
              {
                label: "Request D/O",
                variant: "default",
                onClick: handleSendProposals,
              },
            ]
          : [
            
              {
                label: "Upload S/O",
                variant: "default",
                onClick: handleSendProposals,
              },
            ],
      filterComponent: (
        <BlockBookingInquiriesFilter
          open={filterOpen}
          onClose={handleCloseFilter}
        />
      ),
    },
    {
      label: "Completed",
      component: <BlockView />,
      filterComponent: (
        <BlockBookingInquiriesFilter
          open={filterOpen}
          onClose={handleCloseFilter}
        />
      ),
    },
    {
      label: "New",
      component: <ContractNew />,
      filterComponent: (
        <BlockBookingInquiriesFilter
          open={filterOpen}
          onClose={handleCloseFilter}
        />
      ),
    },
  ];

  const tabs =
    userType === "supplier"
      ? baseTabs
      : [
          ...baseTabs,
          {
            label: "New",
            component: <NewInquiry />,
          },
        ];

  return (
    <>
      <FormTabs tabs={tabs} filterButton onFilterClick={handleOpenFilter} />
      <Modal
        isOpen={isModalOpen}
        columns={columns}
        data={data}
        onClose={handleCloseModal}
        role={userType}
        title={title}
        modalType={modalType}
      />
    </>
  );
}

