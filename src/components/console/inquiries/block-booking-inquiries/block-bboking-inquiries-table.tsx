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

import { DataTable } from "../../data-table";
import {
  BBInquiry,
  getBBInquiryCustomerColumns,
  getBBInquirySupplierColumns,
} from "./columns";

export default function BBInquiriesTable({
  data,
  setData,
  role,
}: {
  data: BBInquiry[];
  setData: React.Dispatch<React.SetStateAction<BBInquiry[]>>;
  role: "customer" | "supplier";
}) {
  const pathname = usePathname();

  const columns =
    role === "customer"
      ? getBBInquiryCustomerColumns()
      : getBBInquirySupplierColumns();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Called from the column's cell
  function handleCloseClick(id: string) {
    setSelectedId(id);
    setConfirmOpen(true);
  }

  async function handleConfirmClose() {
    if (!selectedId) return;
    try {
      const response = await apiCaller(
        `/block-booking/inquiry/decline/${selectedId}`,
        "POST",
        {},
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
    setData((prev) =>
      prev.map((inq) =>
        inq._id === selectedId ? { ...inq, status: "closed" } : inq
      )
    );
  }

  // We can “wrap” the columns array to inject the callback
  const tableColumns = columns.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }: { row: { original: BBInquiry } }) => {
          const item = row.original as BBInquiry;
          const viewUrl = pathname?.includes("/proposals")
            ? `/proposals/block-booking/${item._id}`
            : `/inquiries/block-booking/${item._id}`;

          return (
            <div className="space-x-2">
              {(item.status === "inquiry_sent" ||
                item.status === "proposal_sent") &&
                role === "customer" &&
                pathname?.includes("/inquiries") && (
                  <button
                    className="text-blue-600 underline"
                    onClick={() => handleCloseClick(item._id)}
                  >
                    Close
                  </button>
                )}
              {role === "supplier" && pathname?.includes("/inquiries") && (
                <Link href={`/proposals/new/bb-proposal?id=${item._id}`}>
                  <button className="text-blue-600 underline">Reply</button>
                </Link>
              )}
              <Link href={viewUrl}>
                <button className="text-blue-600 underline">View</button>
              </Link>
              <button className="text-blue-600 underline">Chat</button>
            </div>
          );
        },
      };
    }
    return col;
  });

  return (
    <div>
      {/* The main table */}
      <DataTable
        columns={tableColumns ?? []}
        data={
          Array.isArray(data)
            ? pathname?.includes("/proposals")
              ? data.filter(
                  (item) =>
                    item.status !== "inquiry_sent" &&
                    item.status !== "inquiry_closed"
                )
              : data
            : []
        }
      />

      {/* Confirm close dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this inquiry? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleConfirmClose}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
