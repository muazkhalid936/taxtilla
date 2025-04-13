"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import apiCaller from "@/lib/apiCaller";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { DataTable } from "../../data-table";
import { getCustomerColumns, getSupplierColumns } from "./columns";

// New component for the dropdown menu in the Actions column.
function ViewDropdown({ item }) {
  const [open, setOpen] = React.useState(false);

  const toggleDropdown = () => setOpen((prev) => !prev);

  // It is often a good idea to close the dropdown when clicking outside;
  // for brevity, this example only toggles on clicking the button.
  return (
    <div className="relative inline-block">
      <button onClick={toggleDropdown} className="text-blue-600 underline">
        View
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <Link href={`/contracts/Details/${item.ID}`}>
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Contract Details
            </button>
          </Link>
          <Link href={`/contracts/Allocations`}>
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Allocation
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ContractTable({
  data,
  setData,
  role,
  selectedInquiries,
  setSelectedInquiries,
}) {
  const pathname = usePathname();
  let columns =
    role === "customer" ? getCustomerColumns() : getSupplierColumns();

  if (role === "supplier" && selectedInquiries && setSelectedInquiries) {
    columns = columns.map((col) => {
      if (col.id === "sr") {
        return {
          ...col,
          cell: ({ row }) => {
            const isSelected = selectedInquiries.some(
              (inq) => inq._id === row.original._id
            );
            const isInquirySent = row.original.status === "inquiry_sent";
            return (
              <input
                type="checkbox"
                checked={isSelected}
                disabled={!isInquirySent}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedInquiries((prev) => [...prev, row.original]);
                  } else {
                    setSelectedInquiries((prev) =>
                      prev.filter((inq) => inq._id !== row.original._id)
                    );
                  }
                }}
              />
            );
          },
        };
      }
      return col;
    });
  }

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);
  const [closeReason, setCloseReason] = React.useState("");

  function handleCloseClick(id) {
    setSelectedId(id);
    setCloseReason("");
    setConfirmOpen(true);
  }

  async function handleConfirmClose() {
    if (!closeReason) {
      toast({
        variant: "destructive",
        description: "Please select a reason for closing the inquiry",
      });
      return;
    }

    try {
      const response = await apiCaller(
        `/general/inquiry/close/${selectedId}`,
        "POST",
        { message: closeReason },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        true,
        "json"
      );
      if (response.status === 201) {
        toast({ description: "Inquiry closed successfully!" });
      }
    } catch (error) {
      console.error(error);
    }
    setConfirmOpen(false);
    if (!selectedId) return;

    setData((prev) =>
      prev.map((inq) =>
        inq._id === selectedId ? { ...inq, status: "closed" } : inq
      )
    );
  }

  const tableColumns = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }) => {
          const item = row.original;

          return (
            <div className="space-x-2">
              {/* Replacing the previous plain "View" link with our ViewDropdown component */}
              <ViewDropdown item={item} />

              <button
                onClick={() => console.log(row)}
                className="text-blue-600 underline"
              >
                Upload S/O{" "}
              </button>

              {/* Uncomment or adjust the following buttons as needed */}
              {/* {role === "customer" && item.status !== "inquiry_closed" && (
                <button
                  className="text-blue-600 underline"
                  onClick={() => handleCloseClick(item._id)}
                >
                  Close
                </button>
              )}

              <button className="text-blue-600 underline">Chat</button> */}
            </div>
          );
        },
      };
    }
    return col;
  });

  return (
    <div>
      <DataTable
        columns={tableColumns ?? []}
        data={
          Array.isArray(data)
            ? pathname?.includes("/proposals")
              ? data.filter((item) => item.status !== "inquiry_sent")
              : data
            : []
        }
      />

      {/* Confirm close dialog with reasons can be added here if needed */}
    </div>
  );
}
