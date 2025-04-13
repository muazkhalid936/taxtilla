"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useUserStore } from "@/stores/userStore";

import apiCaller from "@/lib/apiCaller";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContentWrapper } from "@/components/auth/auth-content-wrapper";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";

function SignUpForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const [industryName, setIndustryName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();
  const { toast } = useToast();

  if (!role) {
    router.push(ROUTES.CHOOSE_ROLE);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiCaller(
        "/auth/signup",
        "POST",
        {
          name: industryName,
          businessType: role as string,
          email,
          password,
          passwordConfirmation: confirmPassword,
        },
        {},
        false // No token required for signup
      );

      if (response.status === 200) {
        const { user } = response.data;

        // Store the returned user in Zustand
        setUser(user);

        toast({
          title: "Signup Successful",
          description: "Redirecting to profile completion...",
        });

        router.push(ROUTES.COMPLETE_PROFILE);
      }
    } catch (error: unknown) {
      toast({
        title: "Signup Failed",
        description: (error as Error)?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">WELCOME</h2>
      <h3 className="text-xl mb-6">Create a New Account</h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="industryName">Industry Name</Label>
            <Input
              id="industryName"
              type="text"
              placeholder="Enter your industry name"
              value={industryName}
              onChange={(e) => setIndustryName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full uppercase">
            Get Started
          </Button>
        </div>
      </form>

      <AuthFormFooter
        linkText="LOGIN HERE"
        linkPath="/auth/login"
        linkPrompt="Already have an account?"
      />
    </>
  );
}

export default function SignUpPage() {
  return (
    <AuthContentWrapper
      backgroundImage="/images/Auth/login.svg"
      title="Building the Future..."
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      colorInverted={true}
      hasPortions={true}
    >
      <Suspense fallback={<div>Loading signup form...</div>}>
        <SignUpForm />
      </Suspense>
    </AuthContentWrapper>
  );
}
