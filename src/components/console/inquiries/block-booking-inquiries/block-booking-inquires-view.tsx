"use client";

import { useEffect, useState } from "react";

import apiCaller from "@/lib/apiCaller";
import {
  SummaryColumnDef,
  SummaryTable,
} from "@/components/console/summary-table";

import BBInquiriesTable from "./block-bboking-inquiries-table";
import { BBInquiry } from "./columns";

// Example row type for the summary data
interface InquirySummary {
  postedInq: number;
  rcvdProp: number;
  propAccepted: number;
  contracts: number;
}

// Define summary columns
const columns: SummaryColumnDef<InquirySummary>[] = [
  { id: "postedInq", header: "Posted Inq" },
  { id: "rcvdProp", header: "Rcvd Prop" },
  { id: "propAccepted", header: "Prop Accepted" },
  { id: "contracts", header: "Contracted" },
];

export default function BBInquiriesView() {
  const [userType, setUserType] = useState<"customer" | "supplier" | null>(
    null
  );
  const [data, setData] = useState<BBInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user type from localStorage on client side
    setUserType(localStorage.getItem("user_type") as "customer" | "supplier");

    const fetchData = async () => {
      try {
        const endpoint = "/block-booking/inquiry";
        const response = await apiCaller(
          endpoint,
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching block booking inquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !userType) {
    return <div>Loading inquiries...</div>;
  }

  // Build the summary data based on fetched inquiries
  const summary: InquirySummary[] = [
    {
      postedInq: data.length,
      rcvdProp: 2,
      propAccepted: 1,
      contracts: 0,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Summary table on top */}
      <SummaryTable columns={columns} data={summary} maxWidth={300} />

      {/* Main data table */}
      <BBInquiriesTable data={data} setData={setData} role={userType} />
    </div>
  );
}
