"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CheckIcon } from "lucide-react";

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
        <div className="absolute right-0 top-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[900]">
          <Link href={`/contracts/ContractDetails`}>
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Contract Details
            </button>
          </Link>
          <Link href={`/contracts/Delivery-Details/${item.ID}`}>
            <button
              onClick={() => setOpen(false)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Delivery Details
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

export default function UserTable({
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
  const [customReason, setCustomReason] = React.useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const router = useRouter();

  function handleCloseClick(id) {
    setSelectedId(id);
    setCloseReason("");
    setConfirmOpen(true);
  }

  function handleDeleteClick(id) {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  }

  const tableColumns = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }) => {
          const item = row.original;
          const viewUrl = pathname?.includes("/proposals")
            ? `/proposals/general/${item._id}`
            : `/inquiries/general/${item._id}`;

          return (
            <div className="space-x-2">
              {/* <ViewDropdown item={item} /> */}

              <Link href={"/user-management/User-Info"}>
                <button className="text-blue-600 underline">View</button>
              </Link>
              <button
                className="text-blue-600 underline"
                onClick={() => handleCloseClick(item._id)}
              >
                Edit
              </button>
              <button
                className="text-blue-600 underline"
                onClick={() => handleDeleteClick(item._id)}
              >
                Delete
              </button>

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

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md flex flex-col !gap-10">
          <DialogHeader>
            <DialogDescription>
              <CheckIcon className="h-20 w-20 mx-auto p-3 text-white rounded-full bg-black" />
            </DialogDescription>
            <DialogDescription className="font-bold  text-black text-center text-xl">
              Would you like to update User's info?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              No
            </Button>
            <Button
              type="submit"
              onClick={() => router.push("/user-management/User-Info")}
            >
              Yes{" "}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md flex flex-col !gap-10">
          <DialogHeader>
            <DialogDescription>
              <CheckIcon className="h-20 w-20 mx-auto p-3 text-white rounded-full bg-red-500" />
            </DialogDescription>
            <DialogDescription className="font-bold text-black text-center text-xl">
              Are you sure you want to delete this user?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              No
            </Button>
            <Button
              type="submit"
              onClick={() => {
                // Add your delete logic here
                setDeleteConfirmOpen(false);
              }}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

