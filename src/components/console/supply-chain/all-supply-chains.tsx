"use client";

import { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";

import apiCaller from "@/lib/apiCaller";
import { toast } from "@/hooks/use-toast";

import AcceptContractModal from "./modals/accept-supply-chain-modal";
import ContractDetailsModal from "./modals/contract-detail-modal";
import ProposalDetailsModal from "./modals/proposal-detail-modal";
import SupplyChainTableRow from "./supplychain-table-row";

// Define a type for your supply chain proposal data
interface SupplyChainProposal {
  _id: string;
  userId: {
    _id: string;
    name: string;
    businessType: string;
  };
  supplier?: {
    name: string;
  };
  paymentTerms?: string;
  shipmentTerms?: string;
  businessConditions?: string;
  endDate?: string;
  supplierPaymentTerms?: string;
  supplierShipmentTerms?: string;
  supplierBusinessConditions?: string;
  supplierEndDate?: string;
  status?: string;
  revisions?: any[];
  [key: string]: any;
}

// Define a type for the proposal details state (if different, adjust accordingly)
interface ProposalDetails {
  proposalId: string;
  customerId: string;
  customerName: string;
  paymentTerms: {
    target: string;
    offer?: string;
  };
  shipmentTerms: {
    target: string;
    offer?: string;
  };
  businessConditions: {
    target: string;
    offer?: string;
  };
  contractEndDate: {
    target: string;
    offer?: string;
  };
}

export default function AllSupplyChains() {
  const { user } = useUserStore();
  const [openContractDetails, setOpenContractDetails] = useState(false);
  const [openAcceptContractDetails, setOpenAcceptContractDetails] =
    useState(false);
  const [openProposalDetails, setOpenProposalDetails] = useState(false);
  const [supplyChainData, setSupplyChainData] = useState<SupplyChainProposal[]>(
    []
  );
  const [contractDetails, setContractDetails] =
    useState<SupplyChainProposal | null>(null);
  const [proposalDetails, setProposalDetails] =
    useState<ProposalDetails | null>(null);

  useEffect(() => {
    const fetchSupplyChainData = async () => {
      try {
        const result = await apiCaller(
          "/payment-terms/",
          "GET",
          undefined,
          {},
          true,
          "json"
        );
        if (result.data) {
          setSupplyChainData(result.data);
        }
      } catch (error) {
        console.error("API error:", error);
        toast({
          title: "Failed to fetch supply chain proposals. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchSupplyChainData();
  }, [user]);

  const handleClose = () => {
    setOpenContractDetails(false);
    setOpenProposalDetails(false);
    setOpenAcceptContractDetails(false);
  };

  const handleViewDetails = useCallback(
    (details: SupplyChainProposal) => {
      if (user?.businessType === "supplier") {
        handleReply(details);
      } else {
        setContractDetails(details);
        setOpenContractDetails(true);
      }
    },
    [user?.businessType]
  );

  const handleReply = (details: SupplyChainProposal) => {
    setProposalDetails({
      proposalId: details._id,
      customerId: details.userId._id,
      customerName: details.userId.name,
      paymentTerms: {
        target: details.paymentTerms || "",
        offer: details.supplierPaymentTerms,
      },
      shipmentTerms: {
        target: details.shipmentTerms || "",
        offer: details.supplierShipmentTerms,
      },
      businessConditions: {
        target: details.businessConditions || "",
        offer: details.supplierBusinessConditions,
      },
      contractEndDate: {
        target: details.endDate || "",
        offer: details.supplierEndDate,
      },
    });
    setOpenProposalDetails(true);
  };

  // Parameter is now optional so it can be called without argument.
  const handleAcceptContract = (details?: SupplyChainProposal) => {
    const contractToAccept = details || contractDetails;
    if (contractToAccept) {
      setOpenAcceptContractDetails(true);
    } else {
      toast({ title: "No contract details found", variant: "destructive" });
    }
  };

  // Guard against user being null
  if (!user) return null;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Sr.</th>
              <th className="px-4 py-2 border-b">
                {user.businessType === "supplier" ? "Customer" : "Supplier"}
              </th>
              <th className="px-4 py-2 border-b">Payment Terms</th>
              <th className="px-4 py-2 border-b">Shipment Terms</th>
              <th className="px-4 py-2 border-b">Business Condition</th>
              <th className="px-4 py-2 border-b">Contract End Date</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {supplyChainData.map((row, index) => (
              <SupplyChainTableRow
                key={row._id || index}
                row={row}
                index={index}
                user={user}
                handleViewDetails={() => {
                  handleViewDetails(row);
                  setContractDetails(row);
                }}
                handleReply={() => {
                  handleReply(row);
                  setContractDetails(row);
                }}
                handleAcceptContract={() => {
                  handleAcceptContract(row);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      {openContractDetails && contractDetails && (
        <ContractDetailsModal
          open={openContractDetails}
          onClose={handleClose}
          contractDetails={contractDetails}
        />
      )}

      {openProposalDetails && proposalDetails && (
        <ProposalDetailsModal
          open={openProposalDetails}
          handleClose={handleClose}
          handleAcceptContract={() => {
            handleClose();
            handleAcceptContract();
          }}
          user={user}
          proposalDetails={proposalDetails}
        />
      )}

      {openAcceptContractDetails && contractDetails && (
        <AcceptContractModal
          open={openAcceptContractDetails}
          handleClose={handleClose}
          contractDetails={contractDetails}
          user={user}
        />
      )}
    </>
  );
}
