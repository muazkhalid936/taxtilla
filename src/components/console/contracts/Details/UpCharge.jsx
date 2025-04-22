import React from 'react'
const rows = [
    {
      specs: "12/1 pp Semi Dull waxed (TM:2.7)",
      coneWt: "10-Jun-24",
      qtyBags: 130,
      ratePerBag: 260000,
      startDate: 3380000,
      endDate: 3380000,
      netAmt: 3380000,
      netInclGst: 3988400,
    },
    {
      specs: "12/1 pp Semi Dull waxed (TM:2.7)",
      coneWt: "10-Jun-24",
      qtyBags: 130,
      ratePerBag: 260000,
      startDate: 3380000,
      endDate: 3380000,
      netAmt: 3380000,
      netInclGst: 3988400,
    },
    {
      specs: "12/1 pp Semi Dull waxed (TM:2.7)",
      coneWt: "10-Jun-24",
      qtyBags: 130,
      ratePerBag: 260000,
      startDate: 3380000,
      endDate: 3380000,
      netAmt: 3380000,
      netInclGst: 3988400,
    },
  ];
const Specs = () => {
  return (
    <div className="overflow-x-auto rounded-lg w-[90%] mx-auto mt-10">
    <table className="min-w-full border-collapse text-sm text-left">
      <thead className="bg-blue-50 font-semibold text-gray-800">
        <tr>
          <th className="px-4 py-3 border">Specs</th>
          <th className="px-4 py-3 border">Cone wt</th>
          <th className="px-4 py-3 border">Qty/Bags</th>
          <th className="px-4 py-3 border">Rate/Bag</th>
          <th className="px-4 py-3 border">C. Start Date</th>
          <th className="px-4 py-3 border">C. End Date</th>
          <th className="px-4 py-3 border">Net Amt</th>
          <th className="px-4 py-3 border">Net Incl GST</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {rows.map((row, idx) => (
          <tr key={idx}>
            <td className="px-4 py-3 border">{row.specs}</td>
            <td className="px-4 py-3 border">{row.coneWt}</td>
            <td className="px-4 py-3 border">{row.qtyBags}</td>
            <td className="px-4 py-3 border">{row.ratePerBag}</td>
            <td className="px-4 py-3 border">{row.startDate}</td>
            <td className="px-4 py-3 border">{row.endDate}</td>
            <td className="px-4 py-3 border">{row.netAmt}</td>
            <td className="px-4 py-3 border">{row.netInclGst}</td>
          </tr>
        ))}
        <tr className="bg-blue-50 font-semibold text-gray-800 border-t">
          <td className="px-4 py-3 border">Total</td>
          <td className="px-4 py-3 border"></td>
          <td className="px-4 py-3 border">Sum</td>
          <td className="px-4 py-3 border"></td>
          <td className="px-4 py-3 border"></td>
          <td className="px-4 py-3 border"></td>
          <td className="px-4 py-3 border">Sum</td>
          <td className="px-4 py-3 border">Sum</td>
        </tr>
      </tbody>
    </table>
 
  </div>  )
}

export default Specs