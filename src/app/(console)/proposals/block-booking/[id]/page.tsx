"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";

import apiCaller from "@/lib/apiCaller";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BBInquiryDetails {
  baseSpecs: {
    carded: boolean;
    combed: boolean;
    compact: boolean;
    lycra: boolean;
    plain: boolean;
    slub: boolean;
  };
  paymentTerms: {
    paymentMode: string;
    days: number;
    shipmentTerms: string;
    businessConditions: string;
  };
  _id: string;
  baseCount: number;
  slubUpcharge: number;
  targetBasePrice: number;
  quantity: number;
  quantityType: string;
  deliveryStartDate: string;
  deliveryEndDate: string;
  upperCount: number;
  lowerCount: number;
  countPrices: Array<{
    count: number;
    price: number;
    _id: string;
  }>;
  materialCharges: Array<{
    material: string;
    upcharge: number;
    _id: string;
  }>;
  certificateUpcharges: Array<{
    certificate: string;
    upcharge: number;
    _id: string;
  }>;
  status: string;
}

interface BBProposal {
  paymentTerms: {
    offeredPaymentMode: string;
    offeredDays: number;
    offeredShipmentTerms: string;
    offeredBusinessConditions: string;
  };
  _id: string;
  inquiryId: string;
  supplierId: {
    name: string;
    email: string;
  };
  countPrices: Array<{
    count: number;
    offeredPrice: number;
    _id: string;
  }>;
  materialCharges: Array<{
    material: string;
    offeredUpcharge: number;
    _id: string;
  }>;
  certificateUpcharges: Array<{
    certificate: string;
    offeredUpcharge: number;
    _id: string;
  }>;
  status: string;
}

interface BBInquiryProposalsResponse {
  inquiryDetails: BBInquiryDetails;
  proposals: BBProposal[];
}

export default function BBProposalView() {
  const [userType, setUserType] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BBInquiryProposalsResponse | null>(null);
  const params = useParams();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<BBProposal | null>(
    null
  );

  useEffect(() => {
    // Get user type from localStorage on client side
    setUserType(localStorage.getItem("user_type"));

    async function fetchData() {
      try {
        const response = await apiCaller(
          `/block-booking/proposals/inquiryProposals/${params.id}`,
          "GET",
          null,
          {
            headers: { "Content-Type": "application/json" },
          },
          true,
          "json"
        );

        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch proposals:", error);
        toast({
          description: "Failed to fetch proposals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  // Helper function to get base specs as string
  function getBaseSpecs(specs: BBInquiryDetails["baseSpecs"]) {
    return Object.entries(specs)
      .filter(([, value]) => value)
      .map(([key]) => key)
      .join(", ");
  }

  const handleAcceptClick = (proposal: BBProposal) => {
    setSelectedProposal(proposal);
    setConfirmOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedProposal) return;

    try {
      const response = await apiCaller(
        `/block-booking/proposals/${selectedProposal._id}/accept`,
        "POST",
        {},
        {
          headers: { "Content-Type": "application/json" },
        },
        true,
        "json"
      );

      if (response.status === 201) {
        toast({
          title: "Success!",
          description: "Proposal accepted successfully",
        });
        router.push("/proposals");
      } else {
        throw new Error("Failed to accept proposal");
      }
    } catch (error) {
      console.error("Error accepting proposal:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    } finally {
      setConfirmOpen(false);
      setSelectedProposal(null);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Block Booking Proposals</h1>
          <div className="mt-2">
            <h3 className="text-lg font-semibold">Base Specs</h3>
            <p className="text-gray-600">
              {getBaseSpecs(data.inquiryDetails.baseSpecs)}
            </p>
          </div>
        </div>
        <Badge className="text-md px-3 py-1.5">
          {data.inquiryDetails.status || "Active"}
        </Badge>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-white">
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Field</TableHead>
                <TableHead className="w-48">Inquiry Details</TableHead>
                {data.proposals.map((proposal) => (
                  <TableHead key={proposal._id} className="w-48">
                    <div className="flex flex-col gap-2">
                      <span>{proposal.supplierId.name}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Base Count */}
              <TableRow>
                <TableCell className="font-medium">Base Count</TableCell>
                <TableCell>{data.inquiryDetails.baseCount}</TableCell>
                {data.proposals.map((proposal) => (
                  <TableCell key={proposal._id}>
                    {data.inquiryDetails.baseCount}
                  </TableCell>
                ))}
              </TableRow>

              {/* Quantity */}
              <TableRow>
                <TableCell className="font-medium">Quantity</TableCell>
                <TableCell>{`${data.inquiryDetails.quantity} ${data.inquiryDetails.quantityType}`}</TableCell>
                {data.proposals.map((proposal) => (
                  <TableCell
                    key={proposal._id}
                  >{`${data.inquiryDetails.quantity} ${data.inquiryDetails.quantityType}`}</TableCell>
                ))}
              </TableRow>

              {/* Delivery Period */}
              <TableRow>
                <TableCell className="font-medium">Delivery Period</TableCell>
                <TableCell>
                  {`${dayjs(data.inquiryDetails.deliveryStartDate).format("DD/MM/YYYY")} - ${dayjs(
                    data.inquiryDetails.deliveryEndDate
                  ).format("DD/MM/YYYY")}`}
                </TableCell>
                {data.proposals.map((proposal) => (
                  <TableCell key={proposal._id}>
                    {`${dayjs(data.inquiryDetails.deliveryStartDate).format("DD/MM/YYYY")} - ${dayjs(
                      data.inquiryDetails.deliveryEndDate
                    ).format("DD/MM/YYYY")}`}
                  </TableCell>
                ))}
              </TableRow>

              {/* Count Prices Section */}
              <TableRow>
                <TableCell
                  colSpan={2 + data.proposals.length}
                  className="bg-muted"
                >
                  <span className="font-bold">Count Prices</span>
                </TableCell>
              </TableRow>
              {data.inquiryDetails.countPrices.map((price) => (
                <TableRow key={price._id}>
                  <TableCell className="font-medium">{`Count ${price.count}`}</TableCell>
                  <TableCell>{price.price}</TableCell>
                  {data.proposals.map((proposal) => (
                    <TableCell key={proposal._id}>
                      {
                        proposal.countPrices.find(
                          (p) => p.count === price.count
                        )?.offeredPrice
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Material Charges Section */}
              <TableRow>
                <TableCell
                  colSpan={2 + data.proposals.length}
                  className="bg-muted"
                >
                  <span className="font-bold">Material Charges</span>
                </TableCell>
              </TableRow>
              {data.inquiryDetails.materialCharges.map((material) => (
                <TableRow key={material._id}>
                  <TableCell className="font-medium">
                    {material.material}
                  </TableCell>
                  <TableCell>{material.upcharge}</TableCell>
                  {data.proposals.map((proposal) => (
                    <TableCell key={proposal._id}>
                      {
                        proposal.materialCharges.find(
                          (m) => m.material === material.material
                        )?.offeredUpcharge
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Certificate Charges Section */}
              <TableRow>
                <TableCell
                  colSpan={2 + data.proposals.length}
                  className="bg-muted"
                >
                  <span className="font-bold">Certificate Charges</span>
                </TableCell>
              </TableRow>
              {data.inquiryDetails.certificateUpcharges.map((cert) => (
                <TableRow key={cert._id}>
                  <TableCell className="font-medium">
                    {cert.certificate}
                  </TableCell>
                  <TableCell>{cert.upcharge}</TableCell>
                  {data.proposals.map((proposal) => (
                    <TableCell key={proposal._id}>
                      {
                        proposal.certificateUpcharges.find(
                          (c) => c.certificate === cert.certificate
                        )?.offeredUpcharge
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Payment Terms Section */}
              <TableRow>
                <TableCell
                  colSpan={2 + data.proposals.length}
                  className="bg-muted"
                >
                  <span className="font-bold">Payment Terms</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mode & Days</TableCell>
                <TableCell>{`${data.inquiryDetails.paymentTerms.paymentMode} (${data.inquiryDetails.paymentTerms.days} days)`}</TableCell>
                {data.proposals.map((proposal) => (
                  <TableCell key={proposal._id}>
                    {`${proposal.paymentTerms.offeredPaymentMode} (${proposal.paymentTerms.offeredDays} days)`}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">Shipment Terms</TableCell>
                <TableCell>
                  {data.inquiryDetails.paymentTerms.shipmentTerms}
                </TableCell>
                {data.proposals.map((proposal) => (
                  <TableCell key={proposal._id}>
                    {proposal.paymentTerms.offeredShipmentTerms}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  Business Conditions
                </TableCell>
                <TableCell>
                  {data.inquiryDetails.paymentTerms.businessConditions}
                </TableCell>
                {data.proposals.map((proposal) => (
                  <TableCell key={proposal._id}>
                    {proposal.paymentTerms.offeredBusinessConditions}
                  </TableCell>
                ))}
              </TableRow>

              {/* Actions */}
              <TableRow>
                <TableCell className="font-medium">Actions</TableCell>
                <TableCell>-</TableCell>
                {data.proposals.map((proposal) => (
                  <TableCell key={proposal._id}>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-gray-800"
                      >
                        Chat
                      </Button>
                      {proposal.status === "proposal_sent" &&
                        userType === "customer" && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-black hover:bg-gray-800"
                            onClick={() => handleAcceptClick(proposal)}
                          >
                            Accept
                          </Button>
                        )}
                      {proposal.status === "proposal_accepted" && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 hover:bg-green-200"
                        >
                          Accepted
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Proposal</DialogTitle>
            <DialogDescription>
              Are you sure you want to accept this proposal? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleConfirmAccept}>
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
