"use client";

import { useEffect, useState } from "react";
import { BUSINESS_CONDITION, SUPPLYCHAIN_MODES } from "@/constants";
import { useUserStore } from "@/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import apiCaller from "@/lib/apiCaller";
import { toast } from "@/hooks/use-toast";
// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  paymentMode: z.string().nonempty("Payment mode is required"),
  shipmentTerms: z.string().nonempty("Shipment Terms are required"),
  days: z.coerce.number().min(0, "Days cannot be negative"),
  businessConditions: z.string().nonempty("Business Conditions are required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function GeneralTermsSupplyChain() {
  const { user } = useUserStore();

  const [generalTermId, setGeneralTermId] = useState<string | null>(null);
  const [isGeneralTermNew, setIsGeneralTermNew] = useState(false);

  const SHIPMENT_TERMS = [
    { value: "ex_mill", label: "Ex-Mill" },
    { value: `ex-${user?.name}`, label: `Ex-${user?.name}` },
  ];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMode: "",
      shipmentTerms: "",
      days: 10,
      businessConditions: "",
    },
  });

  useEffect(() => {
    const fetchGeneralTerms = async () => {
      try {
        const result = await apiCaller(
          `/payment-terms/general/${user?._id}`,
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        if (result.data && result.data !== null) {
          const generalTerms = result.data;
          setGeneralTermId(generalTerms._id);
          reset({
            paymentMode: generalTerms.paymentMode,
            shipmentTerms: generalTerms.shipmentTerms,
            days: generalTerms.days,
            businessConditions: generalTerms.businessConditions,
          });
        } else {
          setIsGeneralTermNew(true);
        }
      } catch (error) {
        console.error("API error:", error);
        toast({
          title: "Failed to fetch general terms. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchGeneralTerms();
  }, [user?._id, reset]);

  if (!user) return null;

  const onSubmit = async (values: FormValues) => {
    if (!user) return;
    const generalTermData = { ...values, userId: user._id! };

    try {
      if (isGeneralTermNew || !generalTermId) {
        const result = await apiCaller(
          "/payment-terms/general",
          "POST",
          generalTermData,
          { headers: { "Content-Type": "application/json" } },
          true,
          "json"
        );
        if (result.status === 201) {
          toast({
            title: "General terms added successfully!",
            variant: "default",
          });
          setGeneralTermId(result.data.supplyChainTerm._id);
          setIsGeneralTermNew(false);
        } else {
          toast({
            title: "Failed to add general terms. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        const result = await apiCaller(
          `/payment-terms/general/${generalTermId}`,
          "PUT",
          { ...generalTermData, generalTermId },
          { headers: { "Content-Type": "application/json" } },
          true,
          "json"
        );
        if (result.status === 200) {
          toast({
            title: "General terms updated successfully!",
            variant: "default",
          });
        } else {
          toast({
            title: "Failed to update general terms. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("API error:", error);
      toast({
        title: "Failed to update general terms. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">General Terms</h1>
        <p className="text-sm text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Payment Mode */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Mode
            </label>
            <Controller
              control={control}
              name="paymentMode"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPLYCHAIN_MODES.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.paymentMode && (
              <p className="text-xs text-red-600">
                {errors.paymentMode.message}
              </p>
            )}
          </div>

          {/* Days */}
          <div>
            <label className="block text-sm font-medium mb-1">Days</label>
            <Input
              type="number"
              min={0}
              className="w-full"
              onChange={(e) => setValue("days", Number(e.target.value))}
              value={getValues("days")}
            />
            {errors.days && (
              <p className="text-xs text-red-600">{errors.days.message}</p>
            )}
          </div>

          {/* Shipment Terms */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Shipment Terms
            </label>
            <Controller
              control={control}
              name="shipmentTerms"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select shipment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {SHIPMENT_TERMS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.shipmentTerms && (
              <p className="text-xs text-red-600">
                {errors.shipmentTerms.message}
              </p>
            )}
          </div>

          {/* Business Conditions */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Business Conditions
            </label>
            <Controller
              control={control}
              name="businessConditions"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business conditions" />
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
            {errors.businessConditions && (
              <p className="text-xs text-red-600">
                {errors.businessConditions.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-10">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <Button
              type="submit"
              className="w-full bg-[#212121] text-white hover:bg-[#333] py-2"
            >
              {isGeneralTermNew ? "Add General Terms" : "Update General Terms"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

