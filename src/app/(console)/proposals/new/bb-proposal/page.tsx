"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import BBProposalForm from "@/components/console/proposals/bb-proposals/bb-proposal-form";

function BBProposalContent() {
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("id");

  if (!inquiryId) {
    return <div>Invalid inquiry ID</div>;
  }

  return <BBProposalForm inquiryId={inquiryId} />;
}

export default function BBProposalPage() {
  return (
    <Suspense fallback={<div>Loading proposal form...</div>}>
      <BBProposalContent />
    </Suspense>
  );
}
