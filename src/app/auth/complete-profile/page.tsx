"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/ui/button";
import { AuthContentWrapper } from "@/components/auth/auth-content-wrapper";

export default function CompleteProfilePage() {
  const router = useRouter();

  return (
    <AuthContentWrapper
      contentContainerClassName="h-[60vh]"
      childrenContainerClassName="md:w-full shadow-none"
    >
      <div className="flex flex-col items-center gap-6 justify-center">
        <h1 className="text-3xl font-bold">
          Take a moment to complete your profile
        </h1>
        <p className="text-muted-foreground">
          Let&rsquo;s finish setting up your profile
        </p>
        <div className="flex gap-4 w-1/2">
          <Button
            variant="secondary"
            className="border border-primary flex-1"
            onClick={() => router.push(ROUTES.HOME)}
          >
            Skip for now
          </Button>
          <Button
            className="flex-1"
            onClick={() => router.push(ROUTES.PROFILE_SETUP)}
          >
            Complete My Profile
          </Button>
        </div>
      </div>
    </AuthContentWrapper>
  );
}
