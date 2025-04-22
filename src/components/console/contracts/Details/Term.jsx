import React from "react";

const Term = () => {
  return (
    <div className="w-[90%] mx-auto mt-10 text-sm  text-gray-700">
      <div className="grid grid-cols-3 gap-6">
        <div className="font-semibold">Payment Terms</div>
        <div className="col-span-2">60 days Adv PDC</div>

        <div className="font-semibold">Shipment Terms</div>
        <div className="col-span-2">Ex - Mill</div>

        <div className="font-semibold">Business Cond</div>
        <div className="col-span-2">Non-GST</div>

        <div className="font-semibold">Certificates</div>
        <div className="col-span-2">GRS, EU Ecolabel</div>

        <div className="font-semibold">Claim Adjustment</div>
        <div className="col-span-2">
          Supplier will lift back all the problematic "Packed bags only" in case
          of any quality issue.
        </div>

        <div className="font-semibold">Force Majeure</div>
        <div className="col-span-2">
          If an extreme, unforeseeable event occurs that prevents or delays a
          party from performing their contractual obligations, that party will
          not be in breach of contract as a result of the delay/non-performance.
        </div>

        <div className="font-semibold">Note</div>
        <div className="col-span-2">Subjected to polyester rate</div>
      </div>

      <div className="flex justify-between mt-16 font-semibold">
        <div>Customer Sig</div>
        <div>Supplier Sig</div>
      </div>
    </div>
  );
};

export default Term;
