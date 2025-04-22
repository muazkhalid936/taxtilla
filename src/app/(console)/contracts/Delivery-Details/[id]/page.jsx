"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import React from "react";
import { SummaryTable } from "@/components/console/summary-table";
import apiCaller from "@/lib/apiCaller";
import { useToast } from "@/hooks/use-toast";
import Table from "../../../../../components/console/contracts/Table";

const ContractDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const { user } = useUserStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = `/contracts/detail?id=${id}`;
        const response = await apiCaller(
          endpoint,
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        console.log("ASd",response);
        setData(response.data);
        setLoading(false);
        // console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);
  // const data = Contracts.find((contract) => contract.ID === id);
  console.log("Contract data:", data, id);
  const user_type = localStorage.getItem("user_type");
  const columns =
    user_type === "customer"
      ? [
          { id: "postedInq", header: "Posted Inq" },
          { id: "rcvdProp", header: "Rcvd Prop" },
          { id: "propAccepted", header: "Prop Accepted" },
          { id: "contracted", header: "Contracted" },
        ]
      : [
          { id: "so", header: "S/O" },
          { id: "specs", header: "Specs" },
          { id: "customer", header: "Customer" },
          { id: "qty", header: "Total Qty" },
        ];

  const summary = [
    {
      so: "1122",
      specs: "lorem ipsum dolor sit amet",
      customer: "Ali",
      qty: 100,
    },
  ];

  if (!data) {
    return <p>Contract not found</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-xl">Delivery Details</p>
        </div>

        <div>
          <SummaryTable columns={columns} data={summary} maxWidth={620} />
        </div>
      </div>
      <div className="mt-5">
        <Table />
      </div>
    </>
  );
};

export default ContractDetails;

