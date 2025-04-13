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
          const viewUrl = pathname?.includes("/proposals")
            ? `/proposals/general/${item._id}`
            : `/inquiries/general/${item._id}`;

          return (
            <div className="space-x-2">
              <Link href={`/contracts/Details/${item.ID}`}>
                <button className="text-blue-600 underline">View</button>
              </Link>
              <button
                onClick={() => console.log(row)}
                className="text-blue-600 underline"
              >
             chat
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

      {/* Confirm close dialog with reasons */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Close Inquiry</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this inquiry? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup value={closeReason} onValueChange={setCloseReason}>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem
                  value="target_date_not_met"
                  id="target_date_not_met"
                />
                <Label htmlFor="target_date_not_met">
                  Target Date not met.
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem
                  value="target_rate_not_met"
                  id="target_rate_not_met"
                />
                <Label htmlFor="target_rate_not_met">
                  Target rate not met.
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem
                  value="target_payment_terms_not_met"
                  id="target_payment_terms_not_met"
                />
                <Label htmlFor="target_payment_terms_not_met">
                  Target Payment Terms not met.
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem
                  value="target_quality_not_met"
                  id="target_quality_not_met"
                />
                <Label htmlFor="target_quality_not_met">
                  Target Quality not met.
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem
                  value="target_date_not_met_2"
                  id="target_date_not_met_2"
                />
                <Label htmlFor="target_date_not_met_2">
                  Target Date not met.
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="order_cancelled" id="order_cancelled" />
                <Label htmlFor="order_cancelled">My order was cancelled.</Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem
                  value="wrong_specifications"
                  id="wrong_specifications"
                />
                <Label htmlFor="wrong_specifications">
                  Posted wrong specifications by mistake
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleConfirmClose}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

