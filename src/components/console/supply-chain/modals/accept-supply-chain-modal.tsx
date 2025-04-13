"use client";

import { useState } from "react";

import apiCaller from "@/lib/apiCaller";
import {
  formatBusinessCondition,
  formatDate,
  formatPaymentMode,
  formatShipmentTerm,
} from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfirmationModal from "@/components/confirmation-modal";

type AcceptContractModalProps = {
  open: boolean;
  handleClose: () => void;
  contractDetails: any;
  user: any;
};

export default function AcceptContractModal({
  open,
  handleClose,
  contractDetails,
  user,
}: AcceptContractModalProps) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  if (!contractDetails) return null;

  const { paymentMode, shipmentTerms, businessConditions, endDate } =
    contractDetails;

  const handleAcceptContractClick = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmAcceptContract = async () => {
    try {
      const data = {
        contractId: contractDetails._id,
        supplierId: user._id,
        customerId: contractDetails.userId._id,
      };
      const result = await apiCaller(
        "/payment-terms/accept",
        "POST",
        data,
        { headers: { "Content-Type": "application/json" } },
        true,
        "json"
      );
      if (result.status === 200) {
        toast({ title: "Contract accepted successfully!", variant: "default" });
        handleClose();
      }
    } catch (error) {
      console.error("API error:", error);
      toast({
        title: "Failed to accept contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConfirmationOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Accept Contract</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <tbody>
              <tr>
                <td className="px-4 py-2 font-medium">Payment Terms</td>
                <td className="px-4 py-2">
                  {formatPaymentMode(paymentMode) || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Shipment Terms</td>
                <td className="px-4 py-2">
                  {formatShipmentTerm(shipmentTerms)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Business Conditions</td>
                <td className="px-4 py-2">
                  {formatBusinessCondition(businessConditions)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Contract End Date</td>
                <td className="px-4 py-2">{formatDate(endDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Chat
            </Button>
            <Button onClick={handleAcceptContractClick}>Accept Contract</Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      <ConfirmationModal
        open={confirmationOpen}
        handleClose={() => setConfirmationOpen(false)}
        title="Confirm Acceptance"
        description="Are you sure you want to accept this contract with the listed terms and conditions?"
        confirmLabel="Accept"
        onConfirm={handleConfirmAcceptContract}
        onCancel={() => setConfirmationOpen(false)}
      />
    </Dialog>
  );
}
