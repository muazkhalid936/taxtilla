"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabItem {
  label: string;
  component: React.ReactNode;
  onClick?: () => void;
  otherButtons?: {
    label: string;
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "link"
      | "ghost"
      | "secondary";
    onClick: () => void;
  }[];
  filterComponent?: React.ReactNode;
}

interface FormTabsProps {
  tabs: TabItem[];
  filterButton?: boolean;
  onFilterClick?: () => void;
  buttonLabel?: string;
  buttonStyles?: {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "link"
      | "ghost"
      | "secondary";
  };
}

export default function FormTabs({
  tabs,
  filterButton = false,
  onFilterClick,
  buttonLabel = "Action",
  buttonStyles = { variant: "outline" },
}: FormTabsProps) {
  const router = useRouter();

  // Wrap the search params in Suspense
  const SearchParamsHandler = () => {
    const searchParams = useSearchParams();
    const tabFromParam = searchParams.get("tab");
    const initialIndex = tabFromParam ? parseInt(tabFromParam, 10) : 0;

    const [selectedTab, setSelectedTab] = React.useState(
      isNaN(initialIndex) ? 0 : initialIndex
    );

    React.useEffect(() => {
      if (tabFromParam) {
        const idx = parseInt(tabFromParam, 10);
        if (!isNaN(idx) && idx >= 0 && idx < tabs.length) {
          setSelectedTab(idx);
        }
      }
    }, [tabFromParam]);

    const onTabChange = (value: string) => {
      const idx = parseInt(value, 10);
      setSelectedTab(idx);

      const params = new URLSearchParams();
      params.set("tab", String(idx));
      router.push(`?${params.toString()}`);
    };

    return (
      <Tabs value={String(selectedTab)} onValueChange={onTabChange}>
        <div className="flex items-center justify-between">
          <TabsList className="border-b border-slate-200 bg-transparent">
            {tabs.map((tab, idx) => (
              <TabsTrigger
                key={idx}
                value={String(idx)}
                onClick={tab.onClick}
                className="px-4 py-2 text-sm font-medium text-slate-600 data-[state=active]:text-black"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center">
            {tabs[selectedTab].otherButtons?.map((button, idx) => (
              <Button
                key={idx}
                variant={button.variant || "outline"}
                className="ml-2"
                onClick={button.onClick}
              >
                {button.label}
              </Button>
            ))}

            {filterButton && tabs[selectedTab].filterComponent && (
              <Button
                variant={buttonStyles.variant || "default"}
                className="ml-2"
                onClick={onFilterClick}
              >
                {buttonLabel}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {tabs.map((tab, idx) => (
          <TabsContent key={idx} value={String(idx)} className="p-0 mt-3">
            {tab.component}
          </TabsContent>
        ))}

        {tabs[selectedTab].filterComponent}
      </Tabs>
    );
  };

  return (
    <div className="my-4 rounded border bg-white px-4 pt-3 pb-8 shadow-sm">
      <Suspense fallback={<div>Loading tabs...</div>}>
        <SearchParamsHandler />
      </Suspense>
    </div>
  );
}

