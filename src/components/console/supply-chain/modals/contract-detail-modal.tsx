"use client";

import { useRouter } from "next/navigation";

import {
  formatBusinessCondition,
  formatDate,
  formatPaymentMode,
  formatShipmentTerm,
  formatSupplyChainProposalStatus,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ContractDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  contractDetails: any;
};

export default function ContractDetailsModal({
  open,
  onClose,
  contractDetails,
}: ContractDetailsModalProps) {
  const router = useRouter();

  if (!contractDetails) return null;

  const handleResendProposal = () => {
    // Navigate to the proposals tab with state
    const serializedRow = encodeURIComponent(JSON.stringify(contractDetails));
    router.push(`?tab=1&contractDetails=${serializedRow}`);
  };

  const latestContractData = [
    {
      label: "Payment Terms",
      value: formatPaymentMode(contractDetails.paymentMode) || "N/A",
    },
    {
      label: "Shipment Terms",
      value: formatShipmentTerm(contractDetails.shipmentTerms) || "N/A",
    },
    {
      label: "Business Conditions",
      value:
        formatBusinessCondition(contractDetails.businessConditions) || "N/A",
    },
    {
      label: "Contract End Date",
      value: contractDetails.endDate
        ? formatDate(contractDetails.endDate)
        : "N/A",
    },
    { label: "Days", value: contractDetails.days || "N/A" },
    {
      label: "Status",
      value: formatSupplyChainProposalStatus(
        contractDetails.userId?.businessType,
        contractDetails.status
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle>Contract Details</DialogTitle>
      </DialogHeader>
      <DialogContent>
        {/* Supplier and Customer Names */}
        <div className="flex justify-between mb-3">
          <p className="font-semibold">
            Customer: <span>{contractDetails.userId?.name}</span>
          </p>
          <p className="font-semibold">
            Supplier: <span>{contractDetails.supplier?.name}</span>
          </p>
        </div>

        {/* Current Contract */}
        <h3 className="text-lg mb-2">Current Contract</h3>
        <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg mb-4">
          {latestContractData.map((item, index) => (
            <div key={index}>
              <p className="font-semibold text-sm">{item.label}</p>
              <p className="text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Previous Contracts */}
        {contractDetails.revisions && contractDetails.revisions.length > 0 && (
          <>
            <h3 className="text-lg mb-2">Previous Contracts</h3>
            {contractDetails.revisions.map((revision: any, index: number) => (
              <div
                key={index}
                className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3"
              >
                <div>
                  <p className="font-semibold text-sm">Revision No</p>
                  <p className="text-sm">{revision.revisionNo}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Revision Date</p>
                  <p className="text-sm">{formatDate(revision.revisionDate)}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Payment Mode</p>
                  <p className="text-sm">
                    {formatPaymentMode(revision.paymentMode) || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Shipment Terms</p>
                  <p className="text-sm">
                    {formatShipmentTerm(revision.shipmentTerms) || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Business Conditions</p>
                  <p className="text-sm">
                    {formatBusinessCondition(revision.businessConditions) ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Status</p>
                  <p className="text-sm">
                    {formatSupplyChainProposalStatus(
                      contractDetails.userId?.businessType,
                      revision.status
                    ) || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Days</p>
                  <p className="text-sm">{revision.days || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">End Date</p>
                  <p className="text-sm">
                    {revision.endDate ? formatDate(revision.endDate) : "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </DialogContent>
      <DialogFooter>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Chat
          </Button>
          <Button
            onClick={handleResendProposal}
            disabled={contractDetails.status === "contracted"}
            variant="outline"
          >
            Resend Proposal
          </Button>
          <Button
            onClick={onClose}
            disabled={contractDetails.status === "contracted"}
          >
            Send Contract
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
