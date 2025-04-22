"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import ContractFilter from "@/components/console/contracts/contracts/ContractFilter";
import ContractRunningView from "@/components/console/contracts/Running/ContractRunningView";
import FormTabs from "@/components/console/form-tabs";
import BlockBookingInquiriesFilter from "@/components/console/inquiries/block-booking-inquiries/block-booking-inquires-filter";
import UserView from "@/components/console/UserManage/userView/UserView";

export default function UserManagementPage() {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [userType, setUserType] = React.useState(null);
  const [selectedInquiries, setSelectedInquiries] = React.useState([]);

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
    router.push("/user-management/Create-User");
  }

  const baseTabs = [
    {
      label: "Users",
      component: (
        <UserView
          selectedInquiries={selectedInquiries}
          setSelectedInquiries={setSelectedInquiries}
        />
      ),
      otherButtons: [
        {
          label: "Create User",
          variant: "default",
          onClick: handleSendProposals,
        },
      ],
      filterComponent: (
        <ContractFilter
          open={filterOpen}
          onClose={handleCloseFilter}
          onSave={() => {}}
        />
      ),
    },
    {
      label: "New",
      component: <ContractRunningView />,
      otherButtons: [
        {
          label: "Create User",
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
  ];

  const tabs =
    userType === "supplier"
      ? baseTabs
      : [
          ...baseTabs,
          // {
          //   label: "New",
          //   component: <NewInquiry />,
          // },
        ];

  return (
    <>
      <FormTabs tabs={tabs} filterButton onFilterClick={handleOpenFilter} />
    </>
  );
}

