"use client";

import type React from "react";
import { createContext, useContext } from "react";

interface AuthLayoutContextType {
  backgroundImage: string;
  title: string;
  description: string;
}

const AuthLayoutContext = createContext<AuthLayoutContextType | undefined>(
  undefined
);

export const useAuthLayout = () => {
  const context = useContext(AuthLayoutContext);
  if (context === undefined) {
    throw new Error("useAuthLayout must be used within an AuthLayoutProvider");
  }
  return context;
};

export const AuthLayoutProvider: React.FC<
  AuthLayoutContextType & { children: React.ReactNode }
> = ({ backgroundImage, title, description, children }) => {
  return (
    <AuthLayoutContext.Provider value={{ backgroundImage, title, description }}>
      {children}
    </AuthLayoutContext.Provider>
  );
};
