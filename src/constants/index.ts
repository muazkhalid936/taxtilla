export const SUPPLYCHAIN_MODES = [
  { value: "lc", label: "LC" },
  { value: "pdc", label: "PDC" },
  { value: "credit", label: "Credit" },
  { value: "advance", label: "Advance" },
  { value: "advance_pdc", label: "Advance PDC" },
];

export const CONTRACT_STATUS = [
  { value: "payment_term_sent_received", label: "Payment Term Sent/Received" },
  { value: "payment_term_replied", label: "Payment Term Replied" },
  { value: "contract_sent_received", label: "Contract Sent/Received" },
  { value: "contracted", label: "Contracted" },
  { value: "renew_requested_received", label: "Renew Requested/Received" },
];

export const BUSINESS_CONDITION = [
  { value: "efs", label: "EFS" },
  { value: "gst", label: "GST" },
  { value: "non_gst", label: "Non GST" },
];

export const CERTIFICATES = [
  { value: "GOTS", label: "GOTS" },
  { value: "RWS", label: "RWS" },
  { value: "Global Recycled Standard", label: "Global Recycled Standard" },
  { value: "EU Ecolabel", label: "EU Ecolabel" },
];

export const SPEC_CERTIFICATES = [
  { value: "bci", label: "BCI" },
  { value: "oeko_tex", label: "OEKO-TEX" },
  { value: "cmia", label: "Cotton Made in Africa (CMIA)" },
  { value: "cf", label: "Contamination Free (CF)" },
  { value: "pcw", label: "Post-Consumer Waste (PCW)" },
  { value: "piw", label: "Post-Industrial Waste (PIW)" },
];

export const MATERIALS = [
  { value: "cotton", label: "Cotton" },
  { value: "polyester", label: "Polyester" },
  { value: "viscose", label: "Viscose" },
  { value: "wool", label: "Wool" },
  { value: "silk", label: "Silk" },
  { value: "linen", label: "Linen" },
  { value: "hemp", label: "Hemp" },
  { value: "bamboo", label: "Bamboo" },
  { value: "cashmere", label: "Cashmere" },
  { value: "nylon", label: "Nylon" },
  { value: "acrylic", label: "Acrylic" },
  { value: "trilobal", label: "Trilobal" },
  { value: "tencel", label: "Tencel" },
];

export const BASE_SPECS = [
  { value: "carded", label: "Carded" },
  { value: "combed", label: "Combed" },
  { value: "compact", label: "Compact" },
  { value: "plain", label: "Plain" },
  { value: "slub", label: "Slub" },
  { value: "lycra", label: "Lycra" },
];

export const STATUS_MAPPINGS = {
  customer: {
    inquiry_sent: "Reply Awaited",
    inquiry_replied: "Replied",
    proposal_sent: "Proposal Rcvd",
    negotiation: "Under Negotiation",
    proposal_accepted: "Contract Awaited",
    contract_sent: "Contract Rcvd",
    contract_accepted: "Confirmed",
    contract_running: "Running",
    delivered: "Dlvrd",
    inquiry_closed: "Closed",
  },
  supplier: {
    inquiry_sent: "Pending",
    inquiry_replied: "Replied",
    proposal_sent: "Replied",
    negotiation: "Under Negotiation",
    proposal_accepted: "Prop Accepted",
    contract_sent: "Contract Sent",
    contract_accepted: "Confirmed",
    contract_running: "Running",
    delivered: "Dlvrd",
    inquiry_closed: "Closed",
  },
};
