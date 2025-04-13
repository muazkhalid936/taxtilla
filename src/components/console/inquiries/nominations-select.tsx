"use client";

import { useEffect, useState } from "react";

import apiCaller from "@/lib/apiCaller";
import MultiSelectDropdown from "@/components/multi-select-dropdown";

export interface SupplierOption {
  value: string;
  label: string;
}

interface NominationsSelectProps {
  label?: string;
  state: string[]; // Change from SupplierOption[] to string[]
  setState: (selected: string[]) => void;
}

export default function NominationsSelect({
  label = "Nominations",
  state, // state is now string[] (e.g., supplier IDs)
  setState,
}: NominationsSelectProps) {
  const [options, setOptions] = useState<SupplierOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const response = await apiCaller(
          "/users/suppliers",
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        const supplierOptions = response.data.map(
          (supplier: { _id: string; name: string }) => ({
            value: supplier._id,
            label: supplier.name,
          })
        );
        setOptions(supplierOptions);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSuppliers();
  }, []);

  if (loading) {
    return <div>Loading suppliers...</div>;
  }

  return (
    <MultiSelectDropdown
      label={label}
      state={state} // Now state is string[]
      setState={setState} // setState expects a string[]
      options={options}
    />
  );
}
