import React from "react";

import InputBox from "@/components/common/InputBox";

const Page = () => {
  const data = [
    {
      spec: "",
      ppc: "11DA5S679",
      supplier: "123A5D1079",
      stock: "",
      date: "101",
      quantity: "101",
    },
    {
      spec: "",
      ppc: "128A5G107",
      supplier: "123A5D1079",
      stock: "",
      date: "101",
      quantity: "101",
    },
    {
      spec: "",
      ppc: "135A6G107",
      supplier: "123A5D1079",
      stock: "",
      date: "101",
      quantity: "101",
    },
    {
      spec: "",
      ppc: "PPC",
      supplier: "723A5D1079",
      stock: "",
      date: "101",
      quantity: "3000",
    },
    {
      spec: "",
      ppc: "123A5G107",
      supplier: "123A5D1079",
      stock: "",
      date: "101",
      quantity: "101",
    },
    {
      spec: "",
      ppc: "125A6G107",
      supplier: "123A5D1079",
      stock: "",
      date: "101",
      quantity: "101",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="font-bold">Request D/O</p>

        <p className="w-1/3 text-sm py-1 bg-[#E0EDFF] border border-[#1877F2] px-2 text-center rounded-md">
          Balance from the order is already mentioned in{" "}
          <span className="font-bold">Quantity</span> field, You can edit it to
          type required quantity
        </p>
      </div>

      <div className="mt-4">
        {/* Table-like structure for the rows */}
        {data.map((row, index) => (
          <div key={index} className="grid grid-cols-6 gap-4  p-2 ">
            {/* Spec */}
            <div>
              {/* <label className="block text-sm mb-1">Spec</label> */}
              <InputBox
                title={"Spec"}
                placeholder={"Specification"}
                value={row.spec}
                smallWidth={"20vw"}
              />
            </div>

            {/* PPC */}
            <div>
              <InputBox title={"PPC"} placeholder={row.ppc} smallWidth={"20vw"} />
            </div>

            {/* Supplier */}
            <div>
              <InputBox
                title={"Supplier"}
                placeholder={row.supplier}
                smallWidth={"20vw"}
              />
            </div>

            {/* Stock */}
            <div>
              <InputBox
                title={"Stock"}
                placeholder={"Stock"}
                value={row.stock}
                smallWidth={"20vw"}
              />
            </div>

            {/* Date */}
            <div>
              <InputBox
                title={"Date"}
                placeholder={"Stock"}
                value={row.stock}
                smallWidth={"20vw"}
              />
            </div>

            {/* Quantity */}
            <div>
              <InputBox
                title={"Quantity"}
                placeholder={"200"}
                value={row.stock}
                smallWidth={"20vw"}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end items-center mt-4 ">
        <button className="bg-black ml-auto rounded-md text-white px-4 py-2 mt-4">
          <p className="text-sm">Send</p>
        </button>
      </div>
    </div>
  );
};

export default Page;

