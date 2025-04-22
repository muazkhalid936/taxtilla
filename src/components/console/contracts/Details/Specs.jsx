import React from "react";

const Specs = () => {
  return (
    <div className="overflow-x-auto rounded-lg w-[90%] mx-auto mt-10">
      <table className="min-w-full border-collapse text-sm text-left">
        <thead className="bg-blue-50 font-semibold text-gray-800">
          <tr>
            <th className="px-4 py-3 border">Count Upcharge</th>
            <th className="px-4 py-3 border">Material Upcharge (Per%)</th>
            <th className="px-4 py-3 border">Certificate Upcharge</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          <tr>
            <td className="px-4 py-3 border">
              Upside +3Rs/lbs
              <br />
              Downside -1 Rs/Lbs
            </td>
            <td className="px-4 py-3 border">


                <div>

                    <p>Organic     70Rs</p>
                    <p>Organic     70Rs</p>
                    <p>Organic     70Rs</p>
                    <p>BCI     0.40</p>
                </div>
            </td>
            <td className="px-4 py-3 border">

                <div>
                    <p>None</p>
                </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Specs;

