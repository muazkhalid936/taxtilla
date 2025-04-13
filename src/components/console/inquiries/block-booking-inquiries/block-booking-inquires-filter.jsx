"use client";
import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Example statuses
const statuses = [
  "Not Replied",
  "Proposal Pending",
  "Proposal Accepted",
  "Contract Pending",
  "Contracted",
  "Delivered",
];

export default function BlockBookingInquiriesFilter({ open, onClose }) {
  const [baseCount, setBaseCount] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState([]);

  function handleToggleStatus(status) {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      } else {
        return [...prev, status];
      }
    });
  }

  function handleDeleteStatus(statusToDelete) {
    setSelectedStatuses((prev) => prev.filter((s) => s !== statusToDelete));
  }

  function handleSubmit() {
    console.log("Base Count:", baseCount);
    console.log("Quantity:", quantity);
    console.log("Selected Statuses:", selectedStatuses);

    // Do something with values
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">Filters</span>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-2">
          {/* Base Count */}
          <div>
            <Label>Base Count</Label>
            <Input
              value={baseCount}
              onChange={(e) => setBaseCount(e.target.value)}
              placeholder="Enter base count"
            />
          </div>

          {/* Quantity */}
          <div>
            <Label>Quantity</Label>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>

          {/* Status Selection */}
          <div>
            <Label>Status</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {statuses.map((status) => {
                const isSelected = selectedStatuses.includes(status);
                return (
                  <button
                    key={status}
                    type="button"
                    className={`rounded-full px-3 py-1 text-sm border ${
                      isSelected ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => handleToggleStatus(status)}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            {/* Selected Chips */}
            {selectedStatuses.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedStatuses.map((status) => (
                  <div
                    key={status}
                    className="flex items-center space-x-1 rounded-full bg-accent px-2 py-1 text-sm"
                  >
                    <span>{status}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteStatus(status)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-2 space-x-2">
          <Button variant="default" onClick={handleSubmit} className="bg-black w-full">
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
