"use client";

import { AuthContentWrapper } from "@/components/auth/auth-content-wrapper";
import ProfileOnboardingForm from "@/components/auth/profile-onboarding-form";
import StepsList from "@/components/auth/steps-list";

export default function ProfileSetupPage() {
  return (
    <AuthContentWrapper
      backgroundImage="/images/Auth/profile-setup.svg"
      title="Building the Future..."
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      colorInverted={true}
      hasPortions={true}
      childrenContainerClassName="w-full md:w-4/6"
      sideComponent={<StepsList />}
    >
      <ProfileOnboardingForm />
    </AuthContentWrapper>
  );
}
