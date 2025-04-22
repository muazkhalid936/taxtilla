import React from "react";

const CustomerSupplier = () => {
  return (
    <div className="overflow-x-auto  rounded-lg  w-[90%] mx-auto mt-10">
      <table className="min-w-full border-collapse text-sm text-left">
        <thead className="bg-blue-50 font-semibold text-gray-800">
          <tr>
            <th className="px-6 py-4 border text-center">Customer</th>
            <th className="px-6 py-4 border text-center">Supplier</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          <tr>
            <td className="px-6 py-4 border">Kamal Mills</td>
            <td className="px-6 py-4 border">HK Textiles</td>
          </tr>
          <tr>
            <td className="px-6 py-4    border">
              <div className="flex">
                <p className="w-1/2">Attention</p>
                <p className="w-1/2">Mr. Ali</p>
              </div>
            </td>
            <td className="px-6 py-4    border">
              <div className="flex">
                <p className="w-1/2">Attention</p>
                <p className="w-1/2">Mr. Wahab</p>
              </div>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4    border">
              <div className="flex">
                <p className="w-1/2">NTN</p>
                <p className="w-1/2">11 22 33 44</p>
              </div>
            </td>
            <td className="px-6 py-4    border">
              <div className="flex">
                <p className="w-1/2">NTN</p>
                <p className="w-1/2">44 33 11 55</p>
              </div>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4    border">
              <div className="flex">
                <p className="w-1/2">GST</p>
                <p className="w-1/2">11 22 33 44</p>
              </div>
            </td>
            <td className="px-6 py-4    border">
              <div className="flex">
                <p className="w-1/2">GST</p>
                <p className="w-1/2">11 22 33 44</p>
              </div>
            </td>
          </tr>
          <tr className="">
            <td className="px-6 py-4    border">
              <div className="flex">
                <p className="w-1/2">Address</p>
                <p className="w-1/2">
                  233-B, First Floor, Tulip Block, Sector C, Bahria Town
                </p>
              </div>
            </td>
            <td className="px-6 py-4    border">
              <div className="flex">
                <p className="w-1/2">Address</p>
                <p className="w-1/2">
                  233-B, First Floor, Tulip Block, Sector C, Bahria Town
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="min-w-full border-collapse text-sm mt-10 text-left">
        <thead className="bg-blue-50 font-semibold text-gray-800">
          <tr>
            <th className="px-6 py-4 border text-center">Description</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default CustomerSupplier;
