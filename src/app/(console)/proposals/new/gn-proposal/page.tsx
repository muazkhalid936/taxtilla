"use client";

import { ProposalsForm } from "@/components/console/proposals/gn-proposals/gb-proposal-form";

export default function SendProposalsPageWrapper() {
  return (
    <div className="p-4">
      <h1 className="scroll-m-20 text-2xl font-bold tracking-tight mb-4">
        Send Proposals
      </h1>
      <ProposalsForm />
    </div>
  );
}
