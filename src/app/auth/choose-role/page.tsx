"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/ui/button";
import { AuthContentWrapper } from "@/components/auth/auth-content-wrapper";
import OptionCard from "@/components/auth/option-card";

export default function ChooseRolePage() {
  const [role, setRole] = useState("customer");
  const router = useRouter();

  const handleNext = () => {
    router.push(`${ROUTES.SIGNUP}?role=${role}`);
  };

  return (
    <AuthContentWrapper
      title="Join us and Let&rsquo;s Collaborate"
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      titleSubtitleContainerClassName="max-w-[40%] md:text-center mx-auto"
      childrenContainerClassName="md:w-1/2 shadow-none"
      // sideContainerClassName="basis-full"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {Object.entries(ROLES).map(([label, value]) => (
            <div key={label} className="w-full">
              <OptionCard
                title={`Join as a ${value.charAt(0).toUpperCase()}${value.slice(1)}`}
                selected={role === value}
                onChange={() => setRole(value)}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleNext} className="w-1/2 py-5 mt-4">
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="text-black hover:underline">
            LOGIN HERE
          </Link>
        </p>
      </div>
    </AuthContentWrapper>
  );
}
