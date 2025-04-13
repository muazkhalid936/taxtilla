"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  FileText,
  MessageSquareText,
  RefreshCw,
  Reply,
} from "lucide-react";

import {
  formatBusinessCondition,
  formatDate,
  formatPaymentMode,
  formatShipmentTerm,
  formatSupplyChainProposalStatus,
} from "@/lib/utils";
import ActionPopover from "@/components/action-popover";

interface SupplyChainTableRowProps {
  row: any;
  index: number;
  user: any;
  handleReply: () => void;
  handleViewDetails: () => void;
  handleAcceptContract: () => void;
}

const SupplyChainTableRow: FC<SupplyChainTableRowProps> = ({
  row,
  index,
  user,
  handleReply,
  handleViewDetails,
  handleAcceptContract,
}) => {
  const router = useRouter();

  const actions = [
    {
      label: "Chat",
      onClick: () => alert("Chat clicked"),
      Icon: MessageSquareText,
    },
    {
      label: user.businessType === "supplier" ? "View" : "View Details",
      onClick: handleViewDetails,
      Icon: Eye,
    },
  ];

  if (user.businessType === "supplier") {
    actions.push(
      { label: "Reply", onClick: handleReply, Icon: Reply },
      { label: "Accept", onClick: handleAcceptContract, Icon: FileText }
    );
  } else {
    if (row.status === "proposal_replied") {
      actions.push({ label: "View Reply", onClick: handleReply, Icon: Reply });
    }
    actions.push({
      label: "Send Contract",
      onClick: () => alert("Send Contract clicked"),
      Icon: FileText,
    });
    if (row.endDate && new Date(row.endDate) < new Date()) {
      actions.push({
        label: "Renew Contract",
        onClick: () => {
          const serializedRow = encodeURIComponent(JSON.stringify(row));
          router.push(`?tab=1&row=${serializedRow}`);
        },
        Icon: RefreshCw,
      });
    }
  }

  return (
    <tr className="border-b">
      <td className="px-4 py-2">{index + 1}</td>
      <td className="px-4 py-2">
        {user.businessType === "supplier"
          ? row.userId?.name
          : row.supplier?.name}
      </td>
      <td className="px-4 py-2">{formatPaymentMode(row.paymentMode) ?? "-"}</td>
      <td className="px-4 py-2">{formatShipmentTerm(row.shipmentTerms)}</td>
      <td className="px-4 py-2">
        {formatBusinessCondition(row.businessConditions)}
      </td>
      <td className="px-4 py-2">{formatDate(row.endDate)}</td>
      <td className="px-4 py-2">
        <span className="text-sm text-secondary">
          {formatSupplyChainProposalStatus(user.businessType, row.status)}
        </span>
      </td>
      <td className="px-4 py-2">
        <ActionPopover actions={actions} />
      </td>
    </tr>
  );
};

export default SupplyChainTableRow;
