import { STATUS_MAPPINGS } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Role = keyof typeof STATUS_MAPPINGS;
type GenericStatus = keyof (typeof STATUS_MAPPINGS)[Role];

export const getMappedStatus = (
  role: Role,
  genericStatus: GenericStatus
): string => {
  const roleMappings = STATUS_MAPPINGS[role];
  return roleMappings?.[genericStatus] || "Unknown Status";
};

export const formatShipmentTerm = (term: string) => {
  if (!term?.startsWith("ex_")) return term; // Return term as is if it doesn't start with "ex_"
  return (
    "Ex-" +
    term
      .substring(3)
      .replace(/_/g, "-")
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

export const formatBusinessCondition = (condition: string) => {
  return condition?.replace(/_/g, " ").toUpperCase();
};

export const formatPaymentMode = (mode: string) => {
  return mode?.replace(/_/g, " ").toUpperCase();
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const formatSupplyChainProposalStatus = (
  userType: string,
  status: string
) => {
  switch (status) {
    case "proposal_sent_received":
      return userType === "supplier" ? "Propsal Received" : "Propsal Sent";
    case "proposal_replied":
      return "Proposal Replied";
    case "contract_sent_received":
      return userType === "supplier" ? "Contract Received" : "Contract Sent";
    case "contracted":
      return "Contracted";
    case "renew_requested_received":
      return userType === "supplier" ? "Renew Requested" : "Renew Received";
    default:
      return "Unknown";
  }
};
