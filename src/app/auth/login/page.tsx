"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useUserStore } from "@/stores/userStore";

import apiCaller from "@/lib/apiCaller";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContentWrapper } from "@/components/auth/auth-content-wrapper";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiCaller(
        "/auth/login",
        "POST",
        { email, password },
        {},
        false // No token required for login
      );

      if (response.status === 200) {
        const { token, _id, name, email, businessType } = response.data;

        // Update Zustand store
        setUser({ token, _id, name, email, businessType });

        // Store token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user_name", name);
        localStorage.setItem("user_type", businessType);
        localStorage.setItem("user_id", _id);

        toast({
          title: "Logged in successfully",
          description: "Redirecting to dashboard...",
        });
        router.push(ROUTES.HOME);
      }
    } catch {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContentWrapper
      backgroundImage="/images/Auth/login.svg"
      title="Building the Future..."
      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      colorInverted={true}
      hasPortions={true}
    >
      <h2 className="text-2xl font-bold mb-2">WELCOME BACK</h2>
      <h3 className="text-xl mb-6">Log In to your Account</h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
            <a href="/forgot-password" className="text-sm text-gray-600">
              Forgot Password?
            </a>
          </div>
          <Button type="submit" className="w-full">
            CONTINUE
          </Button>
        </div>
      </form>

      <AuthFormFooter
        linkText="SIGN UP HERE"
        linkPath="/auth/choose-role"
        linkPrompt="New User?"
      />
    </AuthContentWrapper>
  );
}

