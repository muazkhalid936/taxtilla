import React from "react";

import CustomerSupplier from "../../../../components/console/contracts/Details/CustomerSupplier";
import Header from "../../../../components/console/contracts/Details/Header";
import Specs from "../../../../components/console/contracts/Details/Specs";
import Terms from "../../../../components/console/contracts/Details/Term";
import UpCharge from "../../../../components/console/contracts/Details/UpCharge";

const page = () => {
  return (
    <div className="relative">
      <Header />
      <CustomerSupplier />
      <UpCharge />
      <Specs />

      <table className=" mx-auto border-collapse w-[90%] text-sm mt-10 text-left">
        <thead className="bg-blue-50 font-semibold text-gray-800">
          <tr>
            <th className="px-6 py-4 border text-center">Terms & Condition</th>
          </tr>
        </thead>
      </table>
      <Terms />

      <div className="flex justify-end mt-10 w-[90%] mx-auto">
        <button className="px-8 py-2 bg-black text-white rounded-lg transition">
          Accept Contract
        </button>
      </div>
    </div>
  );
};

export default page;

