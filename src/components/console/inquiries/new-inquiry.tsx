"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INQUIRIES } from "@/constants/inquiry-types";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/ui/button";
import OptionCard from "@/components/auth/option-card";

export default function NewInquiry() {
  const router = useRouter();
  const [inquiryType, setInquiryType] = useState("general_inquiry");
  const handleSubmit = () => {
    router.push(`${ROUTES.NEW_INQUIRIES}/${inquiryType.replace(/_/g, "-")}`);
  };

  return (
    <div className="bg-cover bg-center p-8 relative">
      {/* Content */}
      <div className="relative z-20">
        <div className="flex flex-col items-center justify-evenly pt-8 md:pt-12">
          <div className="flex flex-col items-center justify-center md:items-start w-full basis-1/3">
            <div className="pr-0 md:pr-4 mb-8 md:mb-0 text-center max-w-[60%] md:text-center mx-auto">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                Select Inquiry Type
              </h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 md:p-8 w-[90%] md:w-2/3">
            <div className="flex flex-col items-center gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {Object.entries(INQUIRIES).map(([label, value]) => (
                  <div key={label} className="w-full">
                    <OptionCard
                      title={`${value.replace(/_/g, " ").toUpperCase()}`}
                      selected={inquiryType === value}
                      onChange={() => setInquiryType(value)}
                      contentClassName="justify-center"
                      titleClassName="md:text-2xl text-center"
                    />
                  </div>
                ))}
              </div>

              <Button onClick={handleSubmit} className="w-1/2 py-5 mt-4">
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
