"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BUSINESS_CONDITION, CERTIFICATES } from "@/constants";
import dayjs from "dayjs";
import { PlusCircle, Trash } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// shadcn/ui components
import InputWithSelect from "@/components/input-with-select";
import MultiSelect from "@/components/multi-select-dropdown";

import AddSpecDetailsModal from "./add-spec-details-modal";
import { InquiryData } from "./general-inquiry-form";
import NominationsSelect from "./nominations-select";

interface PaymentTerms {
  paymentMode?: string;
  days?: string;
  shipmentTerms?: string;
  businessConditions?: string;
}

export interface GeneralInquiryProps {
  index: number;
  mapIndex: number;
  control: UseFormReturn["control"];
  setValue: UseFormReturn["setValue"];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  handleRemoveInquiry: (idx: number) => void;
  setGeneralInquiryData: Dispatch<SetStateAction<InquiryData[]>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  paymentTerms?: PaymentTerms;
  user?: { name: string };
}

export default function GeneralInquiryComponent({
  index,
  mapIndex,
  control,
  errors,
  handleRemoveInquiry,
  setGeneralInquiryData,
  setValue,
}: GeneralInquiryProps) {
  const [specificationString, setSpecificationString] = useState("");
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("");

  // Get user name from localStorage on client side only
  useEffect(() => {
    setUserName(localStorage.getItem("user_name") || "");
  }, []);

  // Called by <AddSpecDetailsModal> after new specs are chosen
  const handleAddSpecification = (newSpecification: string) => {
    setSpecificationString(newSpecification);
  };

  // Example function to get a default date X days from now
  function getDateAfterDays(days: number) {
    return dayjs().add(days, "day").format("YYYY-MM-DD");
  }

  // For ordinal suffix
  function getOrdinalSuffix(num: number): string {
    let suffix = "th";
    const lastTwoDigits = num % 100;
    const lastDigit = num % 10;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      suffix = "th";
    } else {
      if (lastDigit === 1) {
        suffix = "st";
      } else if (lastDigit === 2) {
        suffix = "nd";
      } else if (lastDigit === 3) {
        suffix = "rd";
      }
    }
    return num + suffix;
  }

  return (
    <div className="mb-4 mt-4 space-y-2">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mapIndex === 0 ? "First" : getOrdinalSuffix(mapIndex + 1)} Inquiry
        </h2>

        {/* Remove button (hidden if index=0) */}
        {index !== 0 && (
          <Button
            variant="ghost"
            onClick={() => handleRemoveInquiry(index)}
            className="flex items-center space-x-1 text-black"
          >
            <Trash className="h-4 w-4" />
            <span>Remove</span>
          </Button>
        )}
      </div>

      {/* Add Specs Button */}
      <Button
        type="button"
        variant="link"
        className="flex items-center p-0 text-black hover:opacity-70"
        onClick={() => setOpen(true)}
      >
        Add Specification here
        <PlusCircle className="ml-1 h-4 w-4" />
      </Button>

      {/* Show specification string if any */}
      {specificationString && (
        <p className="mt-2 italic text-gray-500">{specificationString}</p>
      )}

      {/* Textfields container */}
      <div className="mt-2 flex flex-wrap gap-3">
        {/* PO*/}
        <div className="w-full sm:w-[19%]">
          <Label>PO</Label>
          <Controller
            name={`${index}.po`}
            control={control}
            defaultValue=""
            render={({ field }) => {
              const fieldError = errors?.[index]?.po;
              return (
                <div>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                  {fieldError && (
                    <p className="text-sm text-red-500">{fieldError.message}</p>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Quantity with appended select for kg/lbs/bags */}
        <div className="relative w-full sm:w-[19%]">
          <Controller
            name={`${index}.quantity`}
            control={control}
            defaultValue=""
            rules={{ required: "Quantity is required" }}
            render={({ field }) => {
              const fieldError = errors?.[index]?.quantity;
              return (
                <div>
                  <InputWithSelect
                    label="Quantity*"
                    type="number"
                    value={field.value}
                    onChange={(value) =>
                      field.onChange(value === "" ? "" : Number(value))
                    }
                    selectValue=""
                    onSelectChange={(value) => {
                      setValue(`${index}.quantityType`, value);
                    }}
                    placeholder="Qty"
                    units={["kg", "lbs", "bags"]}
                  />
                  {fieldError && (
                    <p className="text-sm text-red-500">{fieldError.message}</p>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Rate */}
        <div className="w-full sm:w-[19%]">
          <Label>Target Rate *</Label>
          <Controller
            name={`${index}.rate`}
            control={control}
            defaultValue=""
            rules={{
              required: "Rate is required",
              pattern: { value: /^(0|[1-9]\d*)$/, message: "Invalid rate" },
            }}
            render={({ field }) => {
              const fieldError = errors?.[index]?.rate;
              return (
                <div>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                  {fieldError && (
                    <p className="text-sm text-red-500">{fieldError.message}</p>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Delivery Start Date */}
        <div className="w-full sm:w-[19%]">
          <Label>Delivery Start Date *</Label>
          <Controller
            name={`${index}.deliveryStartDate`}
            control={control}
            defaultValue={getDateAfterDays(15)}
            rules={{ required: "Date is required" }}
            render={({ field }) => {
              const fieldError = errors?.[index]?.deliveryStartDate;
              return (
                <div>
                  <Input
                    {...field}
                    type="date"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                  {fieldError && (
                    <p className="text-sm text-red-500">{fieldError.message}</p>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Delivery End Date */}
        <div className="w-full sm:w-[19%]">
          <Label>Delivery End Date *</Label>
          <Controller
            name={`${index}.deliveryEndDate`}
            control={control}
            defaultValue={getDateAfterDays(60)}
            rules={{ required: "Date is required" }}
            render={({ field }) => {
              const fieldError = errors?.[index]?.deliveryEndDate;
              return (
                <div>
                  <Input
                    {...field}
                    type="date"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                  {fieldError && (
                    <p className="text-sm text-red-500">{fieldError.message}</p>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Certification multi-select */}
        <div className="w-full sm:w-[19%]">
          <Controller
            name={`${index}.certification`}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <MultiSelect
                label="Certification"
                state={field.value}
                setState={field.onChange}
                options={CERTIFICATES}
              />
            )}
          />
        </div>

        {/* Payment Terms + Payment Mode inline approach */}
        <div className="relative w-full sm:w-[19%]">
          <Controller
            name={`${index}.paymentDays`}
            control={control}
            render={({ field }) => {
              const fieldError = errors?.[index]?.paymentDays;
              return (
                <div>
                  <InputWithSelect
                    label="Payment Terms"
                    type="number"
                    value={field.value}
                    onChange={(value) =>
                      field.onChange(value === "" ? "" : Number(value))
                    }
                    selectValue={""}
                    onSelectChange={(value) => {
                      setValue(`${index}.paymentMode`, value);
                    }}
                    placeholder="Days"
                    units={["advance", "credit", "pdc", "lc", "advance_pdc"]}
                  />
                  {fieldError && (
                    <p className="text-sm text-red-500">{fieldError.message}</p>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Shipment Terms */}
        <div className="w-full sm:w-[19%]">
          <Label>Shipment Terms</Label>
          <Controller
            name={`${index}.shipmentTerms`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Shipment Terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ex-Mills">Ex-Mills</SelectItem>
                  <SelectItem value={`Ex-${userName}`}>
                    {`Ex-${userName}`}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Business Condition */}
        <div className="w-full sm:w-[19%]">
          <Label>Business Condition</Label>
          <Controller
            name={`${index}.businessCondition`}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Business Condition" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_CONDITION.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Nominations multi-select using the new component */}
        <div className="w-full sm:w-[19%]">
          <Controller
            name={`${index}.nomination`}
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => (
              <NominationsSelect
                state={value || []}
                setState={(selected: string[]) => {
                  onChange(selected || []);
                }}
              />
            )}
          />
        </div>

        {/* Cone.wt */}
        <div className="w-full sm:w-[19%]">
          <Label>Cone.wt</Label>
          <Controller
            name={`${index}.conewt`}
            control={control}
            defaultValue=""
            rules={{
              pattern: { value: /^(0|[1-9]\d*)$/, message: "Invalid entry" },
            }}
            render={({ field }) => {
              const fieldError = errors?.[index]?.conewt;
              return (
                <div>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                  {fieldError && (
                    <p className="text-sm text-red-500">{fieldError.message}</p>
                  )}
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* The "AddSpecDetailsModal" (converted to <Dialog>) */}
      <AddSpecDetailsModal
        open={open}
        index={index}
        setGeneralInquiryData={setGeneralInquiryData}
        onAddSpecification={handleAddSpecification}
        setOpen={setOpen}
      />
    </div>
  );
}
