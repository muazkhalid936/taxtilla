"use client";

import { useEffect, useState } from "react";

import FormTabs from "@/components/console/form-tabs";
import AllSupplyChains from "@/components/console/supply-chain/all-supply-chains";
import GeneralTermsSupplyChain from "@/components/console/supply-chain/general-terms-supply-chain";
import NewSupplyChain from "@/components/console/supply-chain/new-supply-chain";

export default function SupplyChainPage() {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Access localStorage after component has mounted (client-side only)
    setUserType(localStorage.getItem("user_type"));
  }, []);

  const baseTabs = [
    {
      label: "Supply Chains",
      component: <AllSupplyChains />,
      filterComponent: null,
    },
    {
      label: "New",
      component: <NewSupplyChain />,
      filterComponent: null,
    },
  ];

  // Only add the New tab if the user is not a supplier
  const tabs =
    userType === "supplier"
      ? baseTabs
      : [
          ...baseTabs,
          {
            label: "General Terms",
            component: <GeneralTermsSupplyChain />,
            filterComponent: null,
          },
        ];

  return <FormTabs tabs={tabs} />;
}
