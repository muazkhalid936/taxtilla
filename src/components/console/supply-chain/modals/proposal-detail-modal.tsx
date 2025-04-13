"use client";

import { useState } from "react";
import { BUSINESS_CONDITION } from "@/constants";
import { Controller, useForm } from "react-hook-form";

import apiCaller from "@/lib/apiCaller";
import {
  formatBusinessCondition,
  formatDate,
  formatShipmentTerm,
} from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmationModal from "@/components/confirmation-modal";

type ProposalDetailsModalProps = {
  open: boolean;
  handleClose: () => void;
  handleAcceptContract: () => void;
  proposalDetails: any;
  user: any;
};

type FormValues = {
  shipmentTerms: string;
  businessConditions: string;
  contractEndDate: string;
};

export default function ProposalDetailsModal({
  open,
  handleClose,
  handleAcceptContract,
  proposalDetails,
  user,
}: ProposalDetailsModalProps) {
  const { toast } = useToast();
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const {
    proposalId,
    customerId,
    customerName,
    paymentTerms,
    shipmentTerms,
    businessConditions,
    contractEndDate,
  } = proposalDetails;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      shipmentTerms: shipmentTerms?.offer || "",
      businessConditions: businessConditions?.offer || "",
      contractEndDate: contractEndDate?.offer || "",
    },
    mode: "onChange",
  });

  if (!proposalDetails) return null;

  const onSubmit = async (values: FormValues) => {
    if (user.businessType === "supplier") {
      const data = {
        proposalId,
        customerId,
        supplierId: user._id,
        supplierShipmentTerms: values.shipmentTerms,
        supplierBusinessConditions: values.businessConditions,
        supplierEndDate: values.contractEndDate,
      };
      try {
        const result = await apiCaller(
          "/payment-terms/reply",
          "POST",
          data,
          { headers: { "Content-Type": "application/json" } },
          true,
          "json"
        );
        if (result.data) {
          toast({ title: "Reply sent successfully", variant: "default" });
        }
      } catch (error) {
        console.error("API error:", error);
        toast({
          title: "Failed to send reply. Please try again.",
          variant: "destructive",
        });
      }
    }
    handleClose();
  };

  const handleSendReplyClick = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmSendReply = () => {
    handleSubmit(onSubmit)();
    setConfirmationOpen(false);
  };

  const SHIPMENT_TERMS = [
    { value: "ex_mill", label: "Ex-Mill" },
    { value: `ex-${customerName}`, label: `Ex-${customerName}` },
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogHeader>
        <DialogTitle>Proposal Details</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSendReplyClick}>
        <DialogContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Details</th>
                  <th className="px-4 py-2 border">Target</th>
                  <th className="px-4 py-2 border">Offer</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">Payment Terms</td>
                  <td className="px-4 py-2 border">
                    {paymentTerms?.target ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {paymentTerms?.offer ?? "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Shipment Terms</td>
                  <td className="px-4 py-2 border">
                    {formatShipmentTerm(shipmentTerms?.target)}
                  </td>
                  <td className="px-4 py-2 border">
                    {user.businessType === "supplier" ? (
                      <Controller
                        control={control}
                        name="shipmentTerms"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select shipment terms" />
                            </SelectTrigger>
                            <SelectContent>
                              {SHIPMENT_TERMS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    ) : (
                      formatShipmentTerm(shipmentTerms?.offer)
                    )}
                    {errors.shipmentTerms && (
                      <p className="text-xs text-red-600">
                        {errors.shipmentTerms.message}
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Business Conditions</td>
                  <td className="px-4 py-2 border">
                    {formatBusinessCondition(businessConditions?.target)}
                  </td>
                  <td className="px-4 py-2 border">
                    {user.businessType === "supplier" ? (
                      <Controller
                        control={control}
                        name="businessConditions"
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select business conditions" />
                            </SelectTrigger>
                            <SelectContent>
                              {BUSINESS_CONDITION.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    ) : (
                      formatBusinessCondition(businessConditions?.offer)
                    )}
                    {errors.businessConditions && (
                      <p className="text-xs text-red-600">
                        {errors.businessConditions.message}
                      </p>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Contract End Date</td>
                  <td className="px-4 py-2 border">
                    {formatDate(contractEndDate?.target)}
                  </td>
                  <td className="px-4 py-2 border">
                    {user.businessType === "supplier" ? (
                      <Controller
                        control={control}
                        name="contractEndDate"
                        render={({ field }) => (
                          <Input
                            type="date"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    ) : (
                      formatDate(contractEndDate?.offer)
                    )}
                    {errors.contractEndDate && (
                      <p className="text-xs text-red-600">
                        {errors.contractEndDate.message}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogFooter>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Chat
            </Button>
            {user.businessType === "supplier" ? (
              <>
                <Button
                  onClick={handleSendReplyClick}
                  variant="outline"
                  disabled={!isValid || isSubmitting}
                >
                  Send Reply
                </Button>
                <Button onClick={handleAcceptContract}>Accept Contract</Button>
              </>
            ) : (
              <>
                <Button onClick={handleClose} variant="outline">
                  Resend Proposal
                </Button>
                <Button onClick={handleClose}>Send Contract</Button>
              </>
            )}
          </div>
        </DialogFooter>
      </form>

      {confirmationOpen && (
        <ConfirmationModal
          open={confirmationOpen}
          handleClose={() => setConfirmationOpen(false)}
          title="Terms and Conditions"
          description="Are you sure you want to proceed with these terms and conditions?"
          confirmLabel="Send"
          onConfirm={handleConfirmSendReply}
          onCancel={() => setConfirmationOpen(false)}
        />
      )}
    </Dialog>
  );
}
