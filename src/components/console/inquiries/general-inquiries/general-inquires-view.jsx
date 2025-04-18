"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";

import apiCaller from "@/lib/apiCaller";
import {
  
  SummaryTable,
} from "@/components/console/summary-table";

import { Inquiry } from "./columns";
import GeneralInquiriesTable from "./general-inquiries-table";



export default function GeneralInquiriesView({ selectedInquiries,setSelectedInquiries}
  ) {
  const { user } = useUserStore();
  const user_type = localStorage.getItem("user_type");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const endpoint = "/general/inquiry/";
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

  if (!user || loading) {
    return <div>Loading user data...</div>;
  }

  const columns =
    user_type === "customer"
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

  const summary=
    user_type === "customer"
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
      <GeneralInquiriesTable
        data={data}
        setData={setData}
        role={user_type}
        selectedInquiries={selectedInquiries}
        setSelectedInquiries={setSelectedInquiries}
      />
    </div>
  );
}
