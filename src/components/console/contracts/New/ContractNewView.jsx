"use client";

import { useEffect, useState } from "react";
import { ContractRunningData } from "@/data/index";
import { useUserStore } from "@/stores/userStore";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import apiCaller from "@/lib/apiCaller";
import { Label } from "@/components/ui/label";
import { SummaryTable } from "@/components/console/summary-table";

import ContractsTable from "./ContractNewTable";

export default function ContractsBlockView({
  selectedInquiries,
  setSelectedInquiries,
}) {
  const { user } = useUserStore();
  const user_type = localStorage.getItem("user_type");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setData(ContractRunningData);
    setLoading(false);
    // console.log("User data:", Contracts);
    // const fetchData = async () => {
    //   try {
    //     const endpoint = "/general/inquiry/";
    //     const response = await apiCaller(
    //       endpoint,
    //       "GET",
    //       undefined,
    //       {},
    //       true,
    //       "json"
    //     );
    //     setData(Contracts);
    //     setLoading(false)
    //     console.log("Fetched data:", response.data);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchData();
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
          { id: "allocate", header: "Allocated" },
          { id: "dlvr", header: "Delivered" },
          { id: "blncAllocate", header: "Balance to Allocate" },
          { id: "blncDvlr", header: "Balance to Deliver" },
          { id: "avg", header: "Avg Aging/Delay" },
        ]
      : [
          { id: "name", header: "" },
          { id: "netQty", header: "No." },
          { id: "repliedInq", header: "Qty" },
          { id: "propAccepted", header: "Larger Orders" },
          { id: "contracted", header: "Small Orders" },

          { id: "avg", header: "Avg Aging" },
        ];

  const summary =
    user_type != "customer"
      ? [
          {
            name: "Grn_Contract",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
            avg: 100,
            balance: 20,
            blncAllocate: 22,
            blncDvlr: 17,
          },
          {
            blncAllocate: 22,
            blncDvlr: 17,
            name: "Block_Contract ",
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
            blncAllocate: 22,
            blncDvlr: 17,
            name: "Allocations ",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
            avg: 100,
            balance: 20,
          },
        ]
      : [
          {
            name: "Completed ",
            totalInq: data.length,
            netQty: 10,
            repliedInq: 2,
            propAccepted: 1,
            contracted: 0,
            close: 1,
            avg: 100,
            balance: 20,
          },
        ];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex gap-3 items-center">
          <p className="font-medium mx-5">New Contract List</p>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox.Root
              className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white"
              id="other"
              // checked={closeReason.includes("other")}
              // onCheckedChange={(checked) => {
              //   setCloseReason((prev) =>
              //     checked
              //       ? [...prev, "other"]
              //       : prev.filter((item) => item !== "other")
              //   );
              // }}
            >
              <Checkbox.Indicator className="text-gray-900">
                <CheckIcon className="h-3 w-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <Label htmlFor="other" className="text-sm">
              Gen_Contracts
            </Label>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox.Root
              className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white"
              id="other"
              // checked={closeReason.includes("other")}
              // onCheckedChange={(checked) => {
              //   setCloseReason((prev) =>
              //     checked
              //       ? [...prev, "other"]
              //       : prev.filter((item) => item !== "other")
              //   );
              // }}
            >
              <Checkbox.Indicator className="text-gray-900">
                <CheckIcon className="h-3 w-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <Label htmlFor="other" className="text-sm">
              Block_Contracts{" "}
            </Label>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox.Root
              className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white"
              id="other"
              // checked={closeReason.includes("other")}
              // onCheckedChange={(checked) => {
              //   setCloseReason((prev) =>
              //     checked
              //       ? [...prev, "other"]
              //       : prev.filter((item) => item !== "other")
              //   );
              // }}
            >
              <Checkbox.Indicator className="text-gray-900">
                <CheckIcon className="h-3 w-3" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <Label htmlFor="other" className="text-sm">
              Allocations{" "}
            </Label>
          </div>
        </div>
        <SummaryTable columns={columns} data={summary} maxWidth={820} />
      </div>
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

