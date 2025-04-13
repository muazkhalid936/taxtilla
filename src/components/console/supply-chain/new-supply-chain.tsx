"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BUSINESS_CONDITION, SUPPLYCHAIN_MODES } from "@/constants";
// Import the zustand user store
import { useUserStore } from "@/stores/userStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import apiCaller from "@/lib/apiCaller";
// Import the apiCaller utility for making API requests
import { toast } from "@/hooks/use-toast";
// Import shadcn/ui components (adjust paths as needed)
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

// Define the validation schema using Zod
const formSchema = z.object({
  supplier: z.string().min(1, "Supplier is required"),
  paymentMode: z.string().min(1, "Payment mode is required"),
  shipmentTerms: z.string().min(1, "Shipment Terms are required"),
  days: z.coerce.number().min(0, "Days cannot be negative"),
  businessConditions: z.string().min(1, "Business Conditions are required"),
  endDate: z.string().nonempty("Contract End Date is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewSupplyChain() {
  // Get user from the zustand store
  const { user } = useUserStore();

  const params = useParams();
  // Retrieve previous contract info via query params (if any)
  const previousContract = params?.previousContract
    ? JSON.parse(
        Array.isArray(params.previousContract)
          ? params.previousContract[0]
          : params.previousContract
      )
    : null;

  const [suppliers, setSuppliers] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier: previousContract?.supplier?._id || "",
      paymentMode: previousContract?.paymentMode || "",
      shipmentTerms: previousContract?.shipmentTerms || "",
      days: previousContract?.days || 0,
      businessConditions: previousContract?.businessConditions || "",
      endDate: previousContract?.endDate
        ? new Date(previousContract.endDate).toISOString().split("T")[0]
        : "",
    },
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Call the API to get the suppliers list
        const response = await apiCaller(
          "/users/suppliers",
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        if (response.data) {
          setSuppliers(response.data);
          reset({
            supplier:
              previousContract?.supplier?._id || response.data[0]?._id || "",
            paymentMode: previousContract?.paymentMode || "",
            shipmentTerms: previousContract?.shipmentTerms || "",
            days: previousContract?.days || 0,
            businessConditions: previousContract?.businessConditions || "",
            endDate: previousContract?.endDate
              ? new Date(previousContract.endDate).toISOString().split("T")[0]
              : "",
          });
        }
      } catch (error) {
        console.error("API error:", error);
        toast({
          title: "Failed to fetch suppliers. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchSuppliers();
  }, [reset, previousContract]);

  // If no user exists, display a message or redirect as needed.
  if (!user) {
    return <div>Please login to submit a proposal.</div>;
  }

  // Construct shipment terms options based on user name
  const SHIPMENT_TERMS = [
    { value: "ex_mill", label: "Ex-Mill" },
    { value: `ex_${user.name?.toLowerCase()}`, label: `Ex-${user.name}` },
  ];

  const onSubmit = async (data: FormValues) => {
    try {
      const newPaymentTerms = {
        ...data,
        userId: user.id!,
      };
      // Call the API to add a new supply chain proposal
      const result = await apiCaller(
        "/payment-terms/new",
        "POST",
        newPaymentTerms,
        { headers: { "Content-Type": "application/json" } },
        true,
        "json"
      );
      if (result.status === 201) {
        toast({ title: "Proposal sent successfully!" });
      } else {
        toast({
          title: "Failed to send proposal. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("API error:", error);
      toast({
        title:
          error.response?.data?.message ||
          "Failed to send proposal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-screen-lg p-4">
      <div className="mb-6">
        <h4 className="text-2xl font-bold">New Proposal</h4>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-4">
          {/* Supplier */}
          <div className="col-span-12 md:col-span-3">
            <Label htmlFor="supplier">Supplier</Label>
            <Controller
              control={control}
              name="supplier"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((option) => (
                      <SelectItem key={option._id} value={option._id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.supplier && (
              <p className="text-xs text-red-600">{errors.supplier.message}</p>
            )}
          </div>

          {/* Payment Mode */}
          <div className="col-span-12 md:col-span-3">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Controller
              control={control}
              name="paymentMode"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment mode" />
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
          <div className="col-span-12 md:col-span-3">
            <Label htmlFor="days">Days</Label>
            <Input
              type="number"
              id="days"
              min={0}
              {...register("days", { valueAsNumber: true })}
            />
            {errors.days && (
              <p className="text-xs text-red-600">{errors.days.message}</p>
            )}
          </div>

          {/* Shipment Terms */}
          <div className="col-span-12 md:col-span-3">
            <Label htmlFor="shipmentTerms">Shipment Terms</Label>
            <Controller
              control={control}
              name="shipmentTerms"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
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
          <div className="col-span-12 md:col-span-3">
            <Label htmlFor="businessConditions">Business Conditions</Label>
            <Controller
              control={control}
              name="businessConditions"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
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

          {/* Contract End Date */}
          <div className="col-span-12 md:col-span-3">
            <Label htmlFor="endDate">Contract End Date</Label>
            <Input type="date" id="endDate" {...register("endDate")} />
            {errors.endDate && (
              <p className="text-xs text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <div className="w-full md:w-1/2 lg:w-1/3">
            <Button
              type="submit"
              className="w-full bg-[#212121] text-white hover:bg-[#333] py-2"
            >
              Send Proposal
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
