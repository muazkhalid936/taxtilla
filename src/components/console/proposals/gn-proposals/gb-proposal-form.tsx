"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Zustand store for user
import { useUserStore } from "@/stores/userStore";
import { Copy, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import apiCaller from "@/lib/apiCaller";
import { useToast } from "@/hooks/use-toast";
// Hooks & UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ----------------------------------------------------
// Types
// ----------------------------------------------------
export interface Inquiry {
  _id: string;
  customerId: {
    _id: string;
    name: string;
  };
  specifications: string;
  rate?: number;
  quantity?: number;
  quantityType?: string;
  deliveryStartDate: string; // "YYYY-MM-DD"
  deliveryEndDate: string; // "YYYY-MM-DD"
  paymentTerms: {
    paymentMode: string;
    paymentDays: number;
    shipmentTerms: string;
    businessCondition: string;
  };
  po?: number;
  status?: string;
  createdAt?: string;
}

export interface Offer {
  inquiryId: string;
  rate: number | null;
  quantity: number | null;
  quantityType: string | null;
  deliveryStartDate: string;
  deliveryEndDate: string;
  paymentMode: string;
  paymentDays: number | null;
  shipmentTerms: string;
  businessCondition: string;
}

export interface ProposalFormData {
  [key: string]: Offer | undefined;
}

// ----------------------------------------------------
// Component
// ----------------------------------------------------
export function ProposalsForm() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useUserStore((state) => state.user);

  // Format dates helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Load inquiries from session storage
  const [selectedInquiries, setSelectedInquiries] = useState<Inquiry[]>([]);
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedInquiries");
    if (stored) {
      try {
        const parsed: Inquiry[] = JSON.parse(stored);
        setSelectedInquiries(parsed);
      } catch (error) {
        console.error("Error parsing stored inquiries:", error);
      }
    }
  }, []);

  // Create matching offers for each inquiry
  const [offers, setOffers] = useState<Offer[]>([]);
  useEffect(() => {
    setOffers(
      selectedInquiries.map((inquiry) => ({
        inquiryId: inquiry._id,
        rate: inquiry.rate ?? null,
        quantity: inquiry.quantity ?? null,
        quantityType: inquiry.quantityType ?? "",
        deliveryStartDate: inquiry.deliveryStartDate,
        deliveryEndDate: inquiry.deliveryEndDate,
        paymentMode: inquiry.paymentTerms?.paymentMode || "",
        paymentDays: inquiry.paymentTerms?.paymentDays ?? null,
        shipmentTerms: inquiry.paymentTerms?.shipmentTerms || "",
        businessCondition: inquiry.paymentTerms?.businessCondition || "",
      }))
    );
  }, [selectedInquiries]);

  // Setup react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ProposalFormData>({ mode: "onSubmit" });

  // Submit handler
  const onSubmit = async (data: ProposalFormData) => {
    try {
      // Create an array of valid offers based on current selectedInquiries
      const validOffers = selectedInquiries
        .map((inquiry, index) => {
          return data[index.toString()];
        })
        .filter((offer): offer is Offer => offer !== undefined);

      // Check for missing fields
      const missingFields: string[] = [];

      selectedInquiries.forEach((inquiry, index) => {
        const offer = data[index.toString()];
        const customerName = inquiry.customerId.name || `Proposal ${index + 1}`;

        if (!offer) {
          missingFields.push(`Complete proposal for ${customerName}`);
          return;
        }

        if (!offer.rate) missingFields.push(`Rate for ${customerName}`);
        if (!offer.quantity) missingFields.push(`Quantity for ${customerName}`);
        if (!offer.quantityType)
          missingFields.push(`Quantity Type for ${customerName}`);
        if (!offer.deliveryStartDate)
          missingFields.push(`Start Date for ${customerName}`);
        if (!offer.deliveryEndDate)
          missingFields.push(`End Date for ${customerName}`);
        if (!offer.paymentMode)
          missingFields.push(`Payment Mode for ${customerName}`);
        if (!offer.paymentDays)
          missingFields.push(`Payment Days for ${customerName}`);
        if (!offer.shipmentTerms)
          missingFields.push(`Shipment Terms for ${customerName}`);
        if (!offer.businessCondition)
          missingFields.push(`Business Condition for ${customerName}`);
      });

      if (missingFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Missing Fields",
          description: `Please fill in all required fields: ${missingFields.slice(0, 3).join(", ")}${missingFields.length > 3 ? ` and ${missingFields.length - 3} more...` : ""}`,
        });
        return;
      }

      // Map selected inquiries to proposals
      const proposals = selectedInquiries.map((inquiry, index) => {
        const offer = data[index.toString()];

        if (!offer) {
          throw new Error(`Missing offer data for proposal ${index + 1}`);
        }

        return {
          inquiryId: inquiry._id,
          rate: offer.rate,
          quantity: offer.quantity,
          quantityType: offer.quantityType,
          deliveryStartDate: offer.deliveryStartDate,
          deliveryEndDate: offer.deliveryEndDate,
          paymentMode: offer.paymentMode,
          paymentDays: offer.paymentDays,
          shipmentTerms: offer.shipmentTerms,
          businessCondition: offer.businessCondition,
        };
      });

      if (!user?.token) {
        throw new Error("User is not authenticated or no token found.");
      }

      // Make the API call
      const response = await apiCaller(
        "/general/proposals/create",
        "POST",
        { proposals },
        {
          headers: { "Content-Type": "application/json" },
        },
        true,
        "json"
      );

      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Success!",
          description: "Proposal created successfully",
        });
        router.push("/proposals");
      } else {
        throw new Error("Failed to create proposals");
      }
    } catch (error: any) {
      console.error("Failed to create proposals:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong",
      });
    }
  };

  // Copy inquiry data to the offer row
  const handleCopy = (index: number) => {
    const inquiry = selectedInquiries[index];

    // Create a new offer with copied values
    const copiedOffer: Offer = {
      inquiryId: inquiry._id,
      rate: inquiry.rate ?? null,
      quantity: inquiry.quantity ?? null,
      quantityType: inquiry.quantityType || "",
      deliveryStartDate: formatDate(inquiry.deliveryStartDate),
      deliveryEndDate: formatDate(inquiry.deliveryEndDate),
      paymentMode: inquiry.paymentTerms?.paymentMode || "",
      paymentDays: inquiry.paymentTerms?.paymentDays ?? null,
      shipmentTerms: inquiry.paymentTerms?.shipmentTerms || "",
      businessCondition: inquiry.paymentTerms?.businessCondition || "",
    };

    // Update the offers state
    const newOffers = [...offers];
    newOffers[index] = copiedOffer;
    setOffers(newOffers);

    // Update the form values
    setValue(`${index}.rate`, copiedOffer.rate, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`${index}.quantity`, copiedOffer.quantity, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`${index}.quantityType`, copiedOffer.quantityType, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`${index}.deliveryStartDate`, copiedOffer.deliveryStartDate, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`${index}.deliveryEndDate`, copiedOffer.deliveryEndDate, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`${index}.paymentMode`, copiedOffer.paymentMode, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`${index}.paymentDays`, copiedOffer.paymentDays, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`${index}.shipmentTerms`, copiedOffer.shipmentTerms, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`${index}.businessCondition`, copiedOffer.businessCondition, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`${index}.inquiryId`, copiedOffer.inquiryId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Delete an inquiry row (and corresponding offer)
  const handleDelete = (index: number) => {
    // Create new arrays without the deleted item
    const newInquiries = selectedInquiries.filter((_, i) => i !== index);
    const newOffers = offers.filter((_, i) => i !== index);

    // Get the current form values
    const currentValues = getValues();

    // Create a new object without the deleted index
    const newValues: ProposalFormData = {};

    // Rebuild the form values with updated indices
    newInquiries.forEach((inquiry, newIndex) => {
      // Get the old index
      const oldIndex = newIndex >= index ? newIndex + 1 : newIndex;

      // Copy the values if they exist
      if (currentValues[oldIndex.toString()]) {
        newValues[newIndex.toString()] = currentValues[oldIndex.toString()];
      }
    });

    // Update the state with the new arrays
    setSelectedInquiries(newInquiries);
    setOffers(newOffers);

    // Update session storage
    sessionStorage.setItem("selectedInquiries", JSON.stringify(newInquiries));

    // Reset the form with the new values
    // This is a bit hacky but necessary to handle the index shifts
    Object.keys(currentValues).forEach((key) => {
      setValue(key as any, undefined);
    });

    // Set the new values
    Object.entries(newValues).forEach(([key, value]) => {
      if (value) {
        Object.entries(value).forEach(([field, fieldValue]) => {
          setValue(`${key}.${field}` as any, fieldValue);
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ScrollArea className="w-full max-w-[80vw] mx-auto">
        <div className="overflow-x-auto mb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-[50px]">Sr.</TableHead>
                <TableHead className="min-w-[120px]">Customer</TableHead>
                <TableHead className="min-w-[120px]">Spec</TableHead>
                <TableHead className="min-w-[120px]">Rate</TableHead>
                <TableHead className="min-w-[120px]">Qty</TableHead>
                <TableHead className="min-w-[120px]">Start Date</TableHead>
                <TableHead className="min-w-[120px]">End Date</TableHead>
                <TableHead className="min-w-[120px]">Payment Mode</TableHead>
                <TableHead className="min-w-[120px]">Payment Days</TableHead>
                <TableHead className="min-w-[120px]">Shipment Term</TableHead>
                <TableHead className="min-w-[130px]">
                  Business Condition
                </TableHead>
                <TableHead className="min-w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedInquiries.map((inquiry, index) => (
                <React.Fragment key={inquiry._id}>
                  {/* Inquiry Row (Read-Only) */}
                  <TableRow className="bg-muted">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{inquiry.customerId.name}</TableCell>
                    <TableCell>
                      {typeof inquiry.specifications === "string"
                        ? inquiry.specifications
                        : "NA"}
                    </TableCell>
                    <TableCell>Rs. {inquiry.rate ?? "NA"}</TableCell>
                    <TableCell>
                      {inquiry.quantity} {inquiry.quantityType}
                    </TableCell>
                    <TableCell>
                      {formatDate(inquiry.deliveryStartDate)}
                    </TableCell>
                    <TableCell>{formatDate(inquiry.deliveryEndDate)}</TableCell>
                    <TableCell>
                      {inquiry.paymentTerms?.paymentMode ?? "NA"}
                    </TableCell>
                    <TableCell>
                      {inquiry.paymentTerms?.paymentDays ?? "NA"}
                    </TableCell>
                    <TableCell>
                      {inquiry.paymentTerms?.shipmentTerms ?? "NA"}
                    </TableCell>
                    <TableCell>
                      {inquiry.paymentTerms?.businessCondition ?? "NA"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(index)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(index)}
                          type="button"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Offer Row (Editable) */}
                  <TableRow>
                    <TableCell />
                    <TableCell className="font-medium">Offers</TableCell>
                    <TableCell />
                    <TableCell>
                      <Controller
                        name={`${index}.rate` as const}
                        control={control}
                        defaultValue={offers[index]?.rate ?? null}
                        rules={{ required: "Field required" }}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter rate"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
                            />
                          </div>
                        )}
                      />
                      {errors?.[index]?.rate && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[index]?.rate?.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`${index}.quantity` as const}
                        control={control}
                        defaultValue={offers[index]?.quantity ?? null}
                        rules={{ required: "Field required" }}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
                            />
                          </div>
                        )}
                      />
                      {errors?.[index]?.quantity && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[index]?.quantity?.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`${index}.deliveryStartDate` as const}
                        control={control}
                        defaultValue={offers[index]?.deliveryStartDate ?? ""}
                        rules={{ required: "Field required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="date"
                            placeholder="Start Date"
                          />
                        )}
                      />
                      {errors?.[index]?.deliveryStartDate && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[index]?.deliveryStartDate?.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`${index}.deliveryEndDate` as const}
                        control={control}
                        defaultValue={offers[index]?.deliveryEndDate ?? ""}
                        rules={{ required: "Field required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="date"
                            placeholder="End Date"
                          />
                        )}
                      />
                      {errors?.[index]?.deliveryEndDate && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[index]?.deliveryEndDate?.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`${index}.paymentMode` as const}
                        control={control}
                        defaultValue={offers[index]?.paymentMode ?? ""}
                        rules={{ required: "Payment mode is required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger
                              className={
                                errors?.[index]?.paymentMode
                                  ? "border-red-500"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Payment Mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="advance">Advance</SelectItem>
                              <SelectItem value="credit">Credit</SelectItem>
                              <SelectItem value="pdc">PDC</SelectItem>
                              <SelectItem value="advance_pdc">
                                Advance PDC
                              </SelectItem>
                              <SelectItem value="lc">LC</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors?.[index]?.paymentMode && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[index]?.paymentMode?.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`${index}.paymentDays` as const}
                        control={control}
                        defaultValue={offers[index]?.paymentDays ?? null}
                        rules={{ required: "Field required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter Days"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
                          />
                        )}
                      />
                      {errors?.[index]?.paymentDays && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[index]?.paymentDays?.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`${index}.shipmentTerms` as const}
                        control={control}
                        defaultValue={offers[index]?.shipmentTerms ?? ""}
                        rules={{ required: "Shipment terms are required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger
                              className={
                                errors?.[index]?.shipmentTerms
                                  ? "border-red-500"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Shipment Terms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ex_mill">Ex-Mills</SelectItem>
                              <SelectItem
                                value={`ex-${inquiry.customerId.name}`}
                              >
                                {`Ex-${inquiry.customerId.name}`}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors?.[index]?.shipmentTerms && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[index]?.shipmentTerms?.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`${index}.businessCondition` as const}
                        control={control}
                        defaultValue={offers[index]?.businessCondition ?? ""}
                        rules={{ required: "Business condition is required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                          >
                            <SelectTrigger
                              className={
                                errors?.[index]?.businessCondition
                                  ? "border-red-500"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Business Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gst">GST</SelectItem>
                              <SelectItem value="non_gst">NON GST</SelectItem>
                              <SelectItem value="efs">EFS</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors?.[index]?.businessCondition && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[index]?.businessCondition?.message}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()} type="button">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "PROCESSING..." : "SEND PROPOSAL"}
        </Button>
      </div>
    </form>
  );
}
