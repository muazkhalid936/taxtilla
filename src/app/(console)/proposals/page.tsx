"use client";

import * as React from "react";

import FormTabs from "@/components/console/form-tabs";
import BBInquiriesView from "@/components/console/inquiries/block-booking-inquiries/block-booking-inquires-view";
import { Inquiry } from "@/components/console/inquiries/general-inquiries/columns";
import GeneralInquiriesView from "@/components/console/inquiries/general-inquiries/general-inquires-view";
import GeneralInquiriesFilter from "@/components/console/inquiries/general-inquiries/general-inquiries-filter";
import BBProposalsFilter from "@/components/console/proposals/bb-proposals/bb-proposals-filter";

export default function ProposalsPage() {
  const [filterOpen, setFilterOpen] = React.useState(false);

  // function handleOnSave(updatedColumns: ColumnOption[]) {
  //   setGNInquiriesColumns(updatedColumns);
  // }

  function handleOpenFilter() {
    setFilterOpen(true);
  }
  function handleCloseFilter() {
    setFilterOpen(false);
  }

  const tabs = [
    {
      label: "General Proposals",
      component: (
        <GeneralInquiriesView
          selectedInquiries={[]}
          setSelectedInquiries={function (
            _: React.SetStateAction<Inquiry[]>
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      ),
      filterComponent: (
        <GeneralInquiriesFilter
          open={filterOpen}
          onClose={handleCloseFilter}
          onSave={() => {}}
        />
      ),
    },
    {
      label: "Block Booking Proposals",
      component: <BBInquiriesView />,
      filterComponent: (
        <BBProposalsFilter
          open={filterOpen}
          onClose={handleCloseFilter}
          onSave={() => {}}
        />
      ),
    },
  ];

  async function CallgetCustomerInquiries() {
    // try {
    //   const response = await getCustomerInquiries(user._id, user.token);
    //   dispatch(setGNInquiries(response));
    // } catch (error) {
    //   console.error(error);
    // }
  }

  React.useEffect(() => {
    CallgetCustomerInquiries();
  }, []);

  return <FormTabs tabs={tabs} filterButton onFilterClick={handleOpenFilter} />;
}
