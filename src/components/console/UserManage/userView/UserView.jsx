"use client";

import { useEffect, useState } from "react";
import { Contracts } from "@/data/index";
import { useUserStore } from "@/stores/userStore";

import apiCaller from "@/lib/apiCaller";

import ContractsTable from "./UserTable";

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
    return <div>Loading Users...</div>;
  }



  return (
    <div className="space-y-4">
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

