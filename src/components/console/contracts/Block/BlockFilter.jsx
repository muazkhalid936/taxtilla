"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Each column has a name + whether it's checked.
 */
const defaultColumnOptions = [
  { name: "PO1", checked: true },
  { name: "Specifications", checked: true },
  { name: "Quantity", checked: true },
  { name: "Inquiry Posting Date", checked: true },
  { name: "Aging/Delay", checked: true },
  { name: "Status", checked: true },
];

export default function ContractFilter({
  open,
  onClose,
  onSave,
}) {
  // We keep local state for the checkboxes
  const [columns, setColumns] = React.useState(defaultColumnOptions);

  // Toggle a column’s checked property
  function handleToggle(index) {
    setColumns((prev) => {
      const updated = [...prev];
      updated[index].checked = !updated[index].checked;
      return updated;
    });
  }

  // handle “Save”
  function handleSave() {
    onSave(columns);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">Hide/Show</span>
            {/* If you want a close button top-right: */}
            <button
              type="button"
              onClick={onClose}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-4 py-2">
          {/* Table header row: “Select” / “Name” */}
          <div className="mb-2 grid grid-cols-12 gap-2 text-sm font-semibold">
            <div className="col-span-3 bg-muted px-2 py-1 rounded-l-md">
              Select
            </div>
            <div className="col-span-9 bg-muted px-2 py-1 rounded-r-md">
              Name
            </div>
          </div>

          {/* The list of columns */}
          <div className="grid grid-cols-12 gap-y-2 text-sm">
            {columns.map((col, idx) => (
              <React.Fragment key={idx}>
                <div className="col-span-3 flex items-center justify-center">
                  <Checkbox
                    checked={col.checked}
                    onCheckedChange={() => handleToggle(idx)}
                  />
                </div>
                <div className="col-span-9 flex items-center">
                  <span>{col.name}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <DialogFooter className="mt-4 space-x-2">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="w-full bg-black"
            onClick={handleSave}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
