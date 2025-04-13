"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";

import apiCaller from "@/lib/apiCaller";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentTerms {
  paymentMode: string;
  paymentDays: number;
  shipmentTerms: string;
  businessCondition: string;
}

interface InquiryDetails {
  _id: string;
  customerId: {
    _id: string;
    name: string;
  };
  po: number;
  quantity: number;
  quantityType: string;
  rate: number;
  deliveryStartDate: string;
  deliveryEndDate: string;
  certification: string[];
  paymentTerms: PaymentTerms;
  nomination: string[];
  specifications: string;
  conewt: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function InquiryView({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const [inquiry, setInquiry] = useState<InquiryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchInquiryDetails = async () => {
      try {
        const response = await apiCaller(
          `/general/inquiry/${resolvedParams.id}`,
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        setInquiry(response.data.inquiryDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiryDetails();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!inquiry) {
    return <div className="text-center">No inquiry found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Inquiry Details
            <Badge
              className="ml-4"
              variant={
                inquiry.status === "inquiry_sent" ? "default" : "secondary"
              }
            >
              {inquiry.status.replace("_", " ").toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Customer Information
              </h3>
              <p className="text-gray-600">Name: {inquiry.customerId.name}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Order Details</h3>
              <p className="text-gray-600">PO Number: {inquiry.po}</p>
              <p className="text-gray-600">
                Quantity: {inquiry.quantity} {inquiry.quantityType}
              </p>
              <p className="text-gray-600">Rate: Rs. {inquiry.rate}</p>
              <p className="text-gray-600">Cone Weight: {inquiry.conewt}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Delivery Information
              </h3>
              <p className="text-gray-600">
                Start Date: {format(new Date(inquiry.deliveryStartDate), "PPP")}
              </p>
              <p className="text-gray-600">
                End Date: {format(new Date(inquiry.deliveryEndDate), "PPP")}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {inquiry.certification.map((cert) => (
                  <Badge key={cert} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-600">
                Payment Mode: {inquiry.paymentTerms?.paymentMode}
              </p>
              <p className="text-gray-600">
                Payment Days: {inquiry.paymentTerms?.paymentDays}
              </p>
              <p className="text-gray-600">
                Shipment Terms: {inquiry.paymentTerms?.shipmentTerms}
              </p>
              <p className="text-gray-600">
                Business Condition: {inquiry.paymentTerms?.businessCondition}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-2">Specifications</h3>
            <p className="text-gray-600">{inquiry.specifications}</p>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Created: {format(new Date(inquiry.createdAt), "PPP p")}</p>
            <p>Last Updated: {format(new Date(inquiry.updatedAt), "PPP p")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
