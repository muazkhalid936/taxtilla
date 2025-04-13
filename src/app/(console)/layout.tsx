"use client";

import * as React from "react";

import Header from "@/components/header";
import SideNav from "@/components/side-nav";

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      <div className="flex w-full flex-col">
        <Header
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
        />

        <div className="w-full overflow-y-auto bg-[#F8FAFC] p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
