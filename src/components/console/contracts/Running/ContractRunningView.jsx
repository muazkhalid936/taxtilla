"use client";

import { useEffect, useState } from "react";
// import { ContractRunningData } from "@/data/index";
import { ContractRunningData } from "@/data/index";
import { useUserStore } from "@/stores/userStore";

import apiCaller from "@/lib/apiCaller";
import { SummaryTable } from "@/components/console/summary-table";

import ContractsTable from "./ContractTable";

export default function ContractsView({
  selectedInquiries,
  setSelectedInquiries,
}) {
  const { user } = useUserStore();
  const user_type = localStorage.getItem("user_type");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const endpoint = `/contracts/running?user_id=${user._id}`;
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
          { id: "netQty", header: "No." },
          { id: "repliedInq", header: "Qty" },
          { id: "propAccepted", header: "Larger Orders" },
          { id: "contracted", header: "Small Orders" },
          { id: "close", header: "Delivered" },
          { id: "balance", header: "Balance" },
          { id: "avg", header: "Avg Aging/Delay" },
        ]
      : [
          { id: "name", header: "" },
          { id: "netQty", header: "No." },
          { id: "repliedInq", header: "Qty" },
          { id: "propAccepted", header: "Larger Orders" },
          { id: "contracted", header: "Small Orders" },
          { id: "close", header: "Delivered" },
          { id: "balance", header: "Balance" },
          { id: "avg", header: "Avg Aging/Delay" },
        ];

  const summary =
    user_type != "customer"
      ? [
        {
          name: "Gen ",
          totalInq: data.length,
          netQty: 10,
          repliedInq: 2,
          propAccepted: 1,
          contracted: 0,
          close: 1,
          avg: 100,
          balance: 20,
        },
        {
          name: "Allocation",
          balance: 20,
          totalInq: data.length,
          netQty: 10,
          repliedInq: 2,
          propAccepted: 1,

          contracted: 0,
          close: 1,
          avg: 100,
        },
        {
          balance: 20,
          avg: 100,
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
            name: "Gen ",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
            avg: 100,
            balance: 20,
          },
          {
            name: "Allocation",
            balance: 20,
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,

            contracted: 0,
            close: 1,
            avg: 100,
          },
          {
            balance: 20,
            avg: 100,
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
      <SummaryTable columns={columns} data={summary} maxWidth={720} />
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

