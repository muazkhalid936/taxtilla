"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { useUserStore } from "@/stores/userStore";

import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SideNavProps {
  drawerWidth?: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function SideNav({
  drawerWidth = 240,
  mobileOpen,
  handleDrawerToggle,
}: SideNavProps) {
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("user_name");
    const userType = localStorage.getItem("user_type");
    if (token && userId && userName && userType) {
      setUser({
        token: token,
        _id: userId,
        name: userName,
      });
    }
  }, [setUser]);
  // Define the links for the sidebar

  const links = [
    { title: "Home", link: ROUTES.HOME, icon: "/icons/home.svg" },
    { title: "Dashboard", link: ROUTES.DASHBOARD, icon: "/icons/clients.svg" },
    { title: "Inquires", link: ROUTES.INQUIRIES, icon: "/icons/inquires.svg" },
    { title: "Proposals", link: ROUTES.PROPOSALS, icon: "/icons/clients.svg" },
    { title: "Contracts", link: ROUTES.CONTRACTS, icon: "/icons/inquires.svg" },
    {
      title: "Deliveries",
      link: ROUTES.DELIVERIES,
      icon: "/icons/inquires.svg",
    },
    { title: "Invoices", link: ROUTES.INVOICES, icon: "/icons/invoices.svg" },
    {
      title: "Running Orders",
      link: ROUTES.RUNNING_ORDERS,
      icon: "/icons/invoices.svg",
    },
    { title: "Payments", link: ROUTES.PAYMENTS, icon: "/icons/inquires.svg" },
    {
      title: "Tax Challans",
      link: ROUTES.TAX_CHALLANS,
      icon: "/icons/inquires.svg",
    },
    { title: "Clients", link: ROUTES.CLIENTS, icon: "/icons/clients.svg" },
    {
      title: "Hire Agent",
      link: ROUTES.HIRE_AGENT,
      icon: "/icons/inquires.svg",
    },
    { title: "Analytics", link: ROUTES.ANALYTICS, icon: "/icons/clients.svg" },
    {
      title: "Supply Chain",
      link: ROUTES.SUPPLY_CHAIN,
      icon: "/icons/clients.svg",
    },
    {
      title: "User Management",
      link: ROUTES.USER_MANAGEMENT,
      icon: "/icons/clients.svg",
    },
  ];

  const currentPath = usePathname();

  const DrawerContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-4">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="mr-2"
        />
        <h1 className="text-xl font-bold">Logo</h1>
      </div>

      <div className="px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3B8]">
          Menu
        </p>
      </div>

      {/* Scrollable Nav Links */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {links.map((item, index) => {
            const isActive = currentPath === item.link;
            return (
              <li key={index}>
                <Link
                  href={item.link}
                  className={`flex items-center px-4 py-2 text-sm transition-colors
                    ${
                      isActive
                        ? "font-bold text-black"
                        : "text-[#64748B] hover:text-black"
                    }
                  `}
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={20}
                    height={20}
                    className="mr-3 h-5 w-5"
                  />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile SideNav */}
      <Sheet open={mobileOpen} onOpenChange={handleDrawerToggle}>
        <SheetContent side="left" className="h-screen w-[240px] p-0">
          {DrawerContent}
        </SheetContent>
      </Sheet>

      {/* Desktop Permanent Sidebar */}
      <aside
        className="hidden h-screen md:flex md:flex-col"
        style={{ width: drawerWidth }}
      >
        {DrawerContent}
      </aside>
    </>
  );
}

