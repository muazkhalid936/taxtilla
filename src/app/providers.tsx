"use client";

import { ReactNode, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthInitializer />
      {children}
      <Toaster />
    </>
  );
}

function AuthInitializer() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, fetch user info or decode token to enrich user data
      setUser({ token });
    }
  }, [setUser]);

  return null;
}
