"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import FormTabs from "@/components/console/form-tabs";
import BlockBookingInquiriesFilter from "@/components/console/inquiries/block-booking-inquiries/block-booking-inquires-filter";
import BBInquiriesView from "@/components/console/inquiries/block-booking-inquiries/block-booking-inquires-view";
import GeneralInquiriesView from "@/components/console/inquiries/general-inquiries/general-inquires-view";
import GeneralInquiriesFilter from "@/components/console/inquiries/general-inquiries/general-inquiries-filter";
import NewInquiry from "@/components/console/inquiries/new-inquiry";

export default function InquiriesPage() {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [userType, setUserType] = React.useState(null);
  const [selectedInquiries, setSelectedInquiries] = React.useState([]);
  const router = useRouter();

  React.useEffect(() => {
    setUserType(localStorage.getItem("user_type"));
  }, []);

  function handleOpenFilter() {
    setFilterOpen(true);
  }

  function handleCloseFilter() {
    setFilterOpen(false);
  }

  function handleSendProposals() {
    console.log("Send Proposals clicked. Selected Inquiries:", selectedInquiries);
    sessionStorage.setItem("selectedInquiries", JSON.stringify(selectedInquiries));
    router.push("/proposals/new/gn-proposal");
  }

  const baseTabs = [
    {
      label: "General Inquiries",
      component: (
        <GeneralInquiriesView
          selectedInquiries={selectedInquiries}
          setSelectedInquiries={setSelectedInquiries}
        />
      ),
      otherButtons:
        userType === "supplier"
          ? [
              {
                label: "Send Proposals",
                variant: "default",
                onClick: handleSendProposals,
              },
            ]
          : [],
      filterComponent: (
        <GeneralInquiriesFilter
          open={filterOpen}
          onClose={handleCloseFilter}
          onSave={() => {}}
        />
      ),
    },
    {
      label: "Block Booking Inquiries",
      component: <BBInquiriesView />,
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

  return <FormTabs tabs={tabs} filterButton onFilterClick={handleOpenFilter} />;
}
