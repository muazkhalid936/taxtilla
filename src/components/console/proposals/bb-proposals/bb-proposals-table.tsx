import * as React from "react";

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
import { getCustomerColumns, getSupplierColumns, Proposal } from "./columns";

export default function BBProposalsTable({
  data,
  setData,
  role,
}: {
  data: Proposal[];
  setData: React.Dispatch<React.SetStateAction<Proposal[]>>;
  role: "customer" | "supplier";
}) {
  console.log("GeneralInquiriesTable", data);
  const columns =
    role === "customer" ? getCustomerColumns() : getSupplierColumns();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // Called from the column's cell
  function handleCloseClick(id: string) {
    setSelectedId(id);
    setConfirmOpen(true);
  }

  function handleConfirmClose() {
    setConfirmOpen(false);
    if (!selectedId) return;

    // Replace with your actual "close inquiry" service call
    console.log("Closing inquiry with id:", selectedId);

    // Optionally update the data or dispatch Redux...
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: ({ row }: any) => {
          const item = row.original as Proposal;
          return (
            <div className="space-x-2">
              <button className="text-blue-600 underline">View</button>

              {role === "supplier" && (
                <>
                  <button className="text-blue-600 underline">Chat</button>
                  <button
                    className="text-blue-600 underline"
                    onClick={() => handleCloseClick(item._id)}
                  >
                    Send Contract
                  </button>
                </>
              )}
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
        data={Array.isArray(data) ? data : []}
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
