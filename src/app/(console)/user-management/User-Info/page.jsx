import React from "react";

import { Button } from "@/components/ui/button";
import InputBox from "@/components/common/InputBox";

import DropDown from "../../../../components/common/DropDown";

const page = () => {
  const options = [
    {
      value: "",
      label: "Select Supplier",
      disabled: true,
      hidden: true,
      selected: true,
    },
    { value: "apple", label: "Apple" },

    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ];

  return (
    <div className="bg-white p-4">
      <div>
        <h1 className="font-bold text-xl"> User Info</h1>
        <div className="mt-10">
          <div className="flex gap-4">
            <InputBox title={"Username"} placeholder={"John Doe"} />
            <InputBox title={"Designation"} placeholder={"Type Designation"} />
          </div>
          <div className="flex gap-4">
            <InputBox title={"Email"} placeholder={"Johndoe@gmail.com"} />
            <InputBox title={"Password"} placeholder={"Set Password"} />
          </div>
          <div className="flex gap-4">
            <InputBox
              title={"Contact"}
              placeholder={"Enter Your Contact Number"}
            />
            <DropDown title="Select Supplier" options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

