"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import apiCaller from "@/lib/apiCaller";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import GeneralInquiryComponent from "./general-inquiry";

export interface InquiryData {
  id: number;
  specifications?: string;
}

export default function GeneralInquiriesForm() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [generalInquiryData, setGeneralInquiryData] = useState<InquiryData[]>([
    { id: 0 },
  ]);
  const indexRef = useRef(0);

  const [alertState, setAlertState] = useState({
    open: false,
    severity: "success" as "success" | "error",
    message: "Success! Inquiry submitted successfully.",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setValue,
  } = useForm();

  const handleAddInquiry = () => {
    indexRef.current++;
    setGeneralInquiryData((prev) => [...prev, { id: indexRef.current }]);
  };

  const handleRemoveInquiry = (id: number) => {
    setGeneralInquiryData((prev) => prev.filter((x) => x.id !== id));
  };

  // Updated submission handler to call the /general/inquiry/create endpoint.
  // It builds a payload that matches the required format.
  interface FormData {
    [key: number]: {
      quantity: number;
      quantityType: string;
      rate: number;
      deliveryStartDate: string;
      deliveryEndDate: string;
      po: string;
      certification: string[];
      paymentMode: string;
      paymentDays: number;
      shipmentTerms: string;
      businessCondition: string;
      nomination: string[];
      conewt: string;
    };
  }

  const handleSubmitRequest: SubmitHandler<FormData> = async (formData) => {
    if (modalOpen) {
      return; // Prevent submission if modal is open
    }

    const inquiries = generalInquiryData.map((entry) => {
      const data = formData[entry.id] || {};

      // Handle nominations as a string array directly
      const nomination = data.nomination || [];

      return {
        quantity: data.quantity,
        quantityType: data.quantityType,
        rate: data.rate,
        deliveryStartDate: dayjs(data.deliveryStartDate).toISOString(),
        deliveryEndDate: dayjs(data.deliveryEndDate).toISOString(),
        po: data.po,
        certification: data.certification || [],
        paymentMode: data.paymentMode,
        paymentDays: data.paymentDays,
        shipmentTerms: data.shipmentTerms || null,
        businessCondition: data.businessCondition || null,
        nomination,
        specifications: entry.specifications || "",
        conewt: data.conewt,
      };
    });

    const missingFields = inquiries.reduce((missing, inquiry, index) => {
      const inquiryMissing = [];
      if (!inquiry.quantity) inquiryMissing.push("Quantity");
      if (!inquiry.quantityType) inquiryMissing.push("Quantity Type");
      if (!inquiry.rate) inquiryMissing.push("Rate");
      if (!inquiry.deliveryStartDate)
        inquiryMissing.push("Delivery Start Date");
      if (!inquiry.deliveryEndDate) inquiryMissing.push("Delivery End Date");
      if (!inquiry.specifications) inquiryMissing.push("Specifications");
      if (!inquiry.nomination || inquiry.nomination.length === 0)
        inquiryMissing.push("Nomination");

      if (inquiryMissing.length > 0) {
        missing.push(`Inquiry #${index + 1}: ${inquiryMissing.join(", ")}`);
      }

      return missing;
    }, [] as string[]);

    if (missingFields.length > 0) {
      toast({
        description: `Please fill all required fields: ${missingFields.join("; ")}`,
        variant: "destructive",
      });
      return;
    }

    const payload = { inquiries };
    try {
      const response = await apiCaller(
        "/general/inquiry/create",
        "POST",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        },
        true,
        "json"
      );
      if (response.status === 201) {
        toast({ description: "General Inquiry sent successfully!" });
        router.push(`/inquiries/?tab=0`);
      } else {
        toast({
          description: "Failed to send General Inquiry. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        description: "Failed to send BlockBooking Inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (alertState.open) {
      const timer = setTimeout(() => {
        setAlertState((prev) => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertState.open]);

  return (
    <div className="mx-auto mt-4 max-w-screen-lg">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-xl font-bold">General Inquiry Request</h2>

        {alertState.open && (
          <div className="my-2">
            <Alert variant="default">
              <div className="flex w-full justify-between">
                <div>
                  <AlertTitle className="capitalize">
                    {alertState.severity}
                  </AlertTitle>
                  {alertState.message}
                </div>
                <button
                  onClick={() =>
                    setAlertState((prev) => ({ ...prev, open: false }))
                  }
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </Alert>
          </div>
        )}

        <div className="my-4 flex justify-end">
          <Button
            variant="default"
            className="bg-black text-white hover:bg-black/80"
            onClick={handleAddInquiry}
          >
            Add
          </Button>
        </div>

        <form
          onSubmit={
            !modalOpen
              ? handleSubmit(handleSubmitRequest)
              : (e) => e.preventDefault()
          }
        >
          {generalInquiryData.map((item, idx) => (
            <GeneralInquiryComponent
              key={item.id}
              mapIndex={idx}
              index={item.id}
              control={control}
              setValue={setValue}
              setModalOpen={setModalOpen}
              errors={errors}
              handleRemoveInquiry={handleRemoveInquiry}
              setGeneralInquiryData={setGeneralInquiryData}
            />
          ))}

          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white hover:bg-black/80"
            >
              {isSubmitting ? "Processing Request" : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
