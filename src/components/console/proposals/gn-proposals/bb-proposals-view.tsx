"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";

import apiCaller from "@/lib/apiCaller";
import {
  SummaryColumnDef,
  SummaryTable,
} from "@/components/console/summary-table";

import GeneralInquiriesTable from "./bb-proposals-table";
import { Proposal } from "./columns";

// Example row type
interface ProposalSummary {
  totalInq?: number;
  netQty?: number;
  repliedInq?: number;
  postedInq?: number;
  rcvdProp?: number;
  propAccepted: number;
  contracted: number;
}

export default function GNProposalsView() {
  const { user } = useUserStore();
  const [data, setData] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const endpoint = "/general/proposal/";
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
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // If user data is not loaded, show a fallback (or loading indicator)
  if (!user || loading) {
    return <div>Loading user data...</div>;
  }

  // Define columns based on the user business type
  const columns: SummaryColumnDef<ProposalSummary>[] =
    user.businessType === "customer"
      ? [
          { id: "postedInq", header: "Posted Inq" },
          { id: "rcvdProp", header: "Rcvd Prop" },
          { id: "propAccepted", header: "Prop Accepted" },
          { id: "contracted", header: "Contracted" },
        ]
      : [
          { id: "totalInq", header: "Total Inq" },
          { id: "netQty", header: "Net Qty" },
          { id: "repliedInq", header: "Replied Inq" },
          { id: "propAccepted", header: "Prop Accepted" },
          { id: "contracted", header: "Contracted" },
        ];

  // Build summary data accordingly
  const summary: ProposalSummary[] =
    user.businessType === "customer"
      ? [
          {
            postedInq: data.length,
            rcvdProp: 2,
            propAccepted: 1,
            contracted: 0,
          },
        ]
      : [
          {
            totalInq: data.length,
            netQty: 0,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
          },
        ];

  return (
    <div className="space-y-4">
      {/* Summary table on top */}
      <SummaryTable columns={columns} data={summary} maxWidth={420} />

      {/* Main data table */}
      <GeneralInquiriesTable
        data={data}
        setData={setData}
        role={user.businessType ?? "customer"}
      />
    </div>
  );
}
