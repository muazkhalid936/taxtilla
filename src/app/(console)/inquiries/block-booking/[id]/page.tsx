"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

import apiCaller from "@/lib/apiCaller";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BaseSpecs {
  carded: boolean;
  combed: boolean;
  compact: boolean;
  plain: boolean;
  slub: boolean;
  lycra: boolean;
}

interface CountPrice {
  count: number;
  price: number;
}

interface MaterialCharge {
  material: string;
  upcharge: number;
}

interface CertificateUpcharge {
  certificate: string;
  upcharge: number;
}

interface PaymentTerms {
  paymentMode: string;
  days: number;
  shipmentTerms: string;
  businessConditions: string;
}

interface BlockBookingInquiry {
  _id: string;
  customerId: {
    _id: string;
    name: string;
  };
  baseSpecs: BaseSpecs;
  baseCount: number;
  slubUpcharge: number;
  targetBasePrice: number;
  quantity: number;
  quantityType: string;
  deliveryStartDate: string;
  deliveryEndDate: string;
  upperCount: number;
  lowerCount: number;
  countPrices: CountPrice[];
  paymentTerms: PaymentTerms;
  materialCharges: MaterialCharge[];
  certificateUpcharges: CertificateUpcharge[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BlockBookingInquiryView({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const [inquiry, setInquiry] = useState<BlockBookingInquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  React.useEffect(() => {
    // Get user type from localStorage on client side
    setUserType(localStorage.getItem("user_type"));

    const fetchInquiryDetails = async () => {
      try {
        const response = await apiCaller(
          `/block-booking/inquiry/${resolvedParams.id}`,
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        setInquiry(response.data);
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
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Block Booking Inquiry Details
              <Badge
                className="ml-4"
                variant={
                  inquiry.status === "inquiry_sent" ? "default" : "secondary"
                }
              >
                {inquiry.status?.replace("_", " ").toUpperCase() || "N/A"}
              </Badge>
            </CardTitle>
            {userType === "supplier" && inquiry?.status === "inquiry_sent" && (
              <Link href={`/proposals/new/bb-proposal?id=${inquiry._id}`}>
                <Button>Reply</Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Customer Information
              </h3>
              <p className="text-gray-600">
                Name: {inquiry.customerId?.name || "N/A"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Order Details</h3>
              <p className="text-gray-600">
                Base Count: {inquiry.baseCount || "N/A"}
              </p>
              <p className="text-gray-600">
                Target Base Price: ${inquiry.targetBasePrice || "N/A"}
              </p>
              <p className="text-gray-600">
                Quantity: {inquiry.quantity || "N/A"}{" "}
                {inquiry.quantityType || "N/A"}
              </p>
              <p className="text-gray-600">
                Slub Upcharge: ${inquiry.slubUpcharge || "N/A"}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-2">Base Specifications</h3>
            <div className="flex flex-wrap gap-2">
              {inquiry.baseSpecs &&
                Object.entries(inquiry.baseSpecs).map(
                  ([key, value]) =>
                    value && (
                      <Badge key={key} variant="outline">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Badge>
                    )
                )}
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-2">Count Range</h3>
            <p className="text-gray-600">
              Lower Count: {inquiry.lowerCount || "N/A"}
            </p>
            <p className="text-gray-600">
              Upper Count: {inquiry.upperCount || "N/A"}
            </p>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-2">Count Prices</h3>
            {inquiry.countPrices && inquiry.countPrices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Count</TableHead>
                    <TableHead>Price (Rs.)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiry.countPrices.map((cp) => (
                    <TableRow key={cp.count}>
                      <TableCell>{cp.count}</TableCell>
                      <TableCell>Rs.{cp.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-600">No count prices available</p>
            )}
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-2">Material Charges</h3>
            {inquiry.materialCharges && inquiry.materialCharges.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Upcharge (Rs.)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiry.materialCharges.map((mc) => (
                    <TableRow key={mc.material}>
                      <TableCell>{mc.material}</TableCell>
                      <TableCell>Rs.{mc.upcharge}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-600">No material charges available</p>
            )}
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Certificate Upcharges
            </h3>
            {inquiry.certificateUpcharges &&
            inquiry.certificateUpcharges.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Upcharge (Rs.)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiry.certificateUpcharges.map((cu) => (
                    <TableRow key={cu.certificate}>
                      <TableCell>{cu.certificate}</TableCell>
                      <TableCell>Rs.{cu.upcharge}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-600">
                No certificate upcharges available
              </p>
            )}
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
            <p className="text-gray-600">
              Start Date:{" "}
              {inquiry.deliveryStartDate
                ? format(new Date(inquiry.deliveryStartDate), "PPP")
                : "N/A"}
            </p>
            <p className="text-gray-600">
              End Date:{" "}
              {inquiry.deliveryEndDate
                ? format(new Date(inquiry.deliveryEndDate), "PPP")
                : "N/A"}
            </p>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-600">
                Payment Mode: {inquiry.paymentTerms?.paymentMode || "N/A"}
              </p>
              <p className="text-gray-600">
                Payment Days: {inquiry.paymentTerms?.days || "N/A"}
              </p>
              <p className="text-gray-600">
                Shipment Terms: {inquiry.paymentTerms?.shipmentTerms || "N/A"}
              </p>
              <p className="text-gray-600">
                Business Conditions:{" "}
                {inquiry.paymentTerms?.businessConditions || "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              Created:{" "}
              {inquiry.createdAt
                ? format(new Date(inquiry.createdAt), "PPP p")
                : "N/A"}
            </p>
            <p>
              Last Updated:{" "}
              {inquiry.updatedAt
                ? format(new Date(inquiry.updatedAt), "PPP p")
                : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
