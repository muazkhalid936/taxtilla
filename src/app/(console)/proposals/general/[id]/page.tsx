"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Check, MessageSquare } from "lucide-react";

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

interface PaymentTerms {
  paymentMode: string;
  paymentDays: number;
  shipmentTerms: string;
  businessCondition: string;
}

interface InquiryDetails {
  _id: string;
  quantity: number;
  quantityType: string;
  rate: number;
  deliveryStartDate: string;
  deliveryEndDate: string;
  paymentTerms: PaymentTerms;
  specifications: string;
  certification: string;
  status: string;
  po?: number;
}

interface Supplier {
  _id: string;
  name: string;
  email: string;
}

interface Proposal {
  _id: string;
  inquiryId: string;
  supplierId: Supplier;
  rate: number;
  quantity: number;
  quantityType: string;
  paymentTerms: PaymentTerms;
  deliveryStartDate: string;
  deliveryEndDate: string;
  status: string;
}

interface ApiResponse {
  inquiryDetails: InquiryDetails;
  proposals: Proposal[];
}

export default function ProposalShowPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [poModalOpen, setPoModalOpen] = useState(false);
  const [poNumber, setPoNumber] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get user type from localStorage on client side
    setUserType(localStorage.getItem("user_type"));

    const fetchData = async () => {
      try {
        const response = await apiCaller(
          `/general/proposals/${params.id}`,
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching proposal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  const { inquiryDetails, proposals } = data;

  const handleAcceptClick = (proposal: Proposal) => {
    setSelectedProposal(proposal);

    // Check if PO number exists in inquiryDetails
    if (inquiryDetails.po) {
      setConfirmOpen(true);
    } else {
      // Open PO input modal if no PO exists
      setPoModalOpen(true);
    }
  };

  const handleConfirmAccept = async () => {
    if (!selectedProposal) return;

    try {
      const response = await apiCaller(
        `/general/proposals/${selectedProposal._id}/accept`,
        "POST",
        { po: inquiryDetails.po || poNumber },
        {},
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
      setPoModalOpen(false);
    }
  };

  const handlePoSubmit = () => {
    if (poNumber) {
      setPoModalOpen(false);
      setConfirmOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid PO number",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Proposal Details</h1>

      {/* Specifications Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div className="w-2/3">
            <h2 className="text-lg font-semibold mb-2">
              Specification Details
            </h2>
            <p>{inquiryDetails.specifications}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-sm mr-2"> Proposals:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                {proposals.length}
              </span>
            </div>
            {inquiryDetails.po && (
              <div className="flex items-center">
                <span className="text-sm mr-2">PO</span>
                <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded-md">
                  {inquiryDetails.po}
                </span>
              </div>
            )}
            {proposals.length > 0 && (
              <div className="flex items-center">
                <span className="text-sm mr-2">Status</span>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700"
                >
                  Replied
                </Badge>
              </div>
            )}
            {proposals.length === 0 && (
              <div className="flex items-center">
                <span className="text-sm mr-2">Status</span>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700"
                >
                  Reply Awaited
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 text-left">Sr</th>
              <th className="p-3 text-left">Target</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Rate</th>
              <th className="p-3 text-left">Payment Terms</th>
              <th className="p-3 text-left">Shipment Terms</th>
              <th className="p-3 text-left">Business Condition</th>
              <th className="p-3 text-left">Certification</th>
              <th className="p-3 text-left">Start Date</th>
              <th className="p-3 text-left">End Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Inquiry Details Row */}
            <tr className="bg-gray-200">
              <td className="p-3">-</td>
              <td className="p-3">-</td>
              <td className="p-3">
                {inquiryDetails.quantity} {inquiryDetails.quantityType}
              </td>
              <td className="p-3">Rs. {inquiryDetails.rate}</td>
              <td className="p-3">
                {inquiryDetails.paymentTerms.paymentMode} (
                {inquiryDetails.paymentTerms.paymentDays} days)
              </td>
              <td className="p-3">
                {inquiryDetails.paymentTerms.shipmentTerms}
              </td>
              <td className="p-3">
                {inquiryDetails.paymentTerms.businessCondition}
              </td>
              <td className="p-3">{inquiryDetails.certification}</td>
              <td className="p-3">
                {format(
                  new Date(inquiryDetails.deliveryStartDate),
                  "dd/MM/yyyy"
                )}
              </td>
              <td className="p-3">
                {format(new Date(inquiryDetails.deliveryEndDate), "dd/MM/yyyy")}
              </td>
              <td className="p-3">
                <Button variant="outline" size="sm" className="mr-2">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </td>
            </tr>

            {/* Proposals Rows */}
            {proposals.map((proposal, index) => (
              <tr key={proposal._id} className="bg-white hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{proposal.supplierId.name}</td>
                <td className="p-3">
                  {proposal.quantity} {proposal.quantityType}
                </td>
                <td className="p-3">Rs. {proposal.rate}</td>

                <td className="p-3">
                  {proposal.paymentTerms?.paymentMode} (
                  {proposal.paymentTerms?.paymentDays} days)
                </td>
                <td className="p-3">{proposal.paymentTerms?.shipmentTerms}</td>
                <td className="p-3">
                  {proposal.paymentTerms?.businessCondition}
                </td>
                <td className="p-3">{inquiryDetails.certification}</td>
                <td className="p-3">
                  {format(new Date(proposal.deliveryStartDate), "dd/MM/yyyy")}
                </td>
                <td className="p-3">
                  {format(new Date(proposal.deliveryEndDate), "dd/MM/yyyy")}
                </td>
                <td className="p-3">
                  <Button variant="outline" size="sm" className="mr-2">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  {userType === "customer" &&
                    proposal.status === "proposal_sent" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-100 text-green-700 hover:bg-green-200"
                        onClick={() => handleAcceptClick(proposal)}
                      >
                        <Check className="h-4 w-4" />
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {/* PO Number Input Dialog */}
      <Dialog open={poModalOpen} onOpenChange={setPoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter PO Number</DialogTitle>
            <DialogDescription>
              Please enter a Purchase Order (PO) number to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label
              htmlFor="po-number"
              className="text-sm font-medium block mb-2"
            >
              PO Number
            </label>
            <input
              id="po-number"
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={poNumber || ""}
              onChange={(e) =>
                setPoNumber(e.target.value ? Number(e.target.value) : null)
              }
              placeholder="Enter PO number"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPoModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handlePoSubmit}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
