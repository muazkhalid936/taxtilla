"use client";

import { useEffect, useState } from "react";
import { Contracts } from "@/data/index";
import { useUserStore } from "@/stores/userStore";

import apiCaller from "@/lib/apiCaller";
import { SummaryTable } from "@/components/console/summary-table";

import ContractsTable from "./ContractTable";

export default function ContractsView({
  selectedInquiries,
  setSelectedInquiries,
}) {
  const { user } = useUserStore();
  console.log("User from store:", user);
  const user_type = localStorage.getItem("user_type");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log("User data:", user._id);
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const endpoint = `/contracts/all?user_id=${user._id}`;
        const response = await apiCaller(
          endpoint,
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        // console.log(response);
        setData(response.data);
        setLoading(false);
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user || loading) {
    return <div>Loading Contracts...</div>;
  }

  const columns =
    user_type === "customer"
      ? [
          { id: "name", header: "" },
          { id: "netQty", header: "Running" },
          { id: "repliedInq", header: "Completed" },
          { id: "propAccepted", header: "Cancelled" },
          { id: "contracted", header: "Paused" },
          { id: "close", header: "Closed" },
        ]
      : [
          { id: "name", header: "" },
          { id: "netQty", header: "Running" },
          { id: "repliedInq", header: "Completed" },
          { id: "propAccepted", header: "Cancelled" },
          { id: "contracted", header: "Paused" },
          { id: "close", header: "Closed" },
        ];

  const summary =
    user_type != "customer"
      ? [
          {
            name: "Gen orders",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
          },
          {
            name: "Block Booking",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
          },
          {
            name: "Total",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
          },
        ]
      : [
          {
            name: "Gen orders",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
          },
          {
            name: "Orders Booking",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
          },
          {
            name: "Total",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
          },
        ];

  return (
    <div className="space-y-4">
      <SummaryTable columns={columns} data={summary} maxWidth={620} />
      <ContractsTable
        data={data}
        setData={setData}
        role={user_type}
        selectedInquiries={selectedInquiries}
        setSelectedInquiries={setSelectedInquiries}
      />
    </div>
  );
}

