"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

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

  const [saved, setSaved] = React.useState(false);
  const [closed, setClosed] = React.useState(true);
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
          const viewUrl = pathname?.includes("/proposals")
            ? `/proposals/general/${item._id}`
            : `/inquiries/general/${item._id}`;

          return (
            <div className="space-x-2">
              <ViewDropdown item={item} />
              <button
                onClick={() => console.log(row)}
                className="text-blue-600 underline"
              >
                Cancel
              </button>
              <button
                className="text-blue-600 underline"
                onClick={() => handleCloseClick(item._id)}
              >
                Close
              </button>{" "}
              <Link href={viewUrl}>
                <button className="text-blue-600 underline">Pause</button>
              </Link>
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

      {/* Confirm close dialog with reasons */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          className={` transition-all ease-in-out duration-300 sm:max-w-md`}
        >
          {!saved && closed && (
            <>
              <DialogHeader>
                <DialogTitle>Reason</DialogTitle>
              </DialogHeader>

              <div className="py-4 space-y-2">
                {/* Payment Issue */}
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox.Root
                    className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white"
                    id="target_date_not_met"
                    checked={closeReason.includes("target_date_not_met")}
                    onCheckedChange={(checked) => {
                      setCloseReason((prev) =>
                        checked
                          ? [...prev, "target_date_not_met"]
                          : prev.filter(
                              (item) => item !== "target_date_not_met"
                            )
                      );
                    }}
                  >
                    <Checkbox.Indicator className="text-gray-900">
                      <CheckIcon className="h-3 w-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <Label htmlFor="target_date_not_met" className="text-sm">
                    Payment Issue
                  </Label>
                </div>

                {/* Production Delay */}
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox.Root
                    className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white"
                    id="target_rate_not_met"
                    checked={closeReason.includes("target_rate_not_met")}
                    onCheckedChange={(checked) => {
                      setCloseReason((prev) =>
                        checked
                          ? [...prev, "target_rate_not_met"]
                          : prev.filter(
                              (item) => item !== "target_rate_not_met"
                            )
                      );
                    }}
                  >
                    <Checkbox.Indicator className="text-gray-900">
                      <CheckIcon className="h-3 w-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <Label htmlFor="target_rate_not_met" className="text-sm">
                    Production Delay
                  </Label>
                </div>

                {/* Other */}
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox.Root
                    className="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white"
                    id="other"
                    checked={closeReason.includes("other")}
                    onCheckedChange={(checked) => {
                      setCloseReason((prev) =>
                        checked
                          ? [...prev, "other"]
                          : prev.filter((item) => item !== "other")
                      );
                    }}
                  >
                    <Checkbox.Indicator className="text-gray-900">
                      <CheckIcon className="h-3 w-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <Label htmlFor="other" className="text-sm">
                    Other
                  </Label>
                </div>

                {/* Custom Reason */}
                <div>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="flex-1 border w-full rounded-md h-20 max-h-80 min-h-10 p-2"
                    placeholder="Provide additional details..."
                  />
                </div>
              </div>
            </>
          )}
          {saved && closed && (
            <>
              <div className="py-4 space-y-2">
                {/* Payment Issue */}
                <p className="text-center">
                  You can close the order if there's one or fewer bag remaining
                  please note The order will be considered closed only after
                  confirmation from The Customer
                </p>
              </div>
            </>
          )}
          {!closed && (
            <>
              <div className="py-4 space-y-2">
                {/* Payment Issue */}
                <p className="text-center">
                  Your request to close the order has been sent to Customer for
                  Confirmation
                </p>
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className={`${closed ? "flex" : "hidden"}`}
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`${!saved && closed ? "flex" : "hidden"}`}
              onClick={() => setSaved(true)}
            >
              Save{" "}
            </Button>
            <Button
              type="submit"
              className={`${saved && closed ? "flex" : "hidden"}`}
              onClick={() => setClosed(false)}
            >
              Close{" "}
            </Button>
            <Button
              type="submit"
              className={`${!closed ? "flex mx-auto" : "hidden"}`}
              onClick={() => setConfirmOpen(false)}
            >
              Ok{" "}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

