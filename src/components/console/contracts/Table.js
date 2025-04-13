// components/Table.js
import { tableData } from "@/data/index";

export default function Table() {
  return (
    <div className="overflow-x-scroll min-w-[1200px]">
      <div className="flex font-bold text-[16px] ">
        <div className="w-[70px] flex border-[#B5CEE1] border bg-[#F4FAFF] items-center justify-center">
          Sr.
        </div>
        <div className="border-[#B5CEE1] bg-[#F4FAFF] py-4 px-4 flex-1 border flex justify-between">
          <div className="text-center min-w-40 w-1/4">Required</div>
          <div className="text-center min-w-40 w-1/4">Dispatched</div>
          <div className="text-center min-w-40 w-1/4">Received </div>
          <div className="text-center w-1/4 min-w-40">Aging/Delay </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-[70px] flex border-[#B5CEE1] border bg-[#F4FAFF] items-center justify-center">
          {""}
        </div>
        <div className="border-[#B5CEE1] font-bold bg-[#F4FAFF] py-4 px-4 flex-1 border flex justify-between">
        <div className="w-1/4  min-w-40 flex ">
            <div className="w-1/2 text-center">Quantity</div>
            <div className="w-1/2 text-center">Date</div>
          </div>

          <div className="w-1/4  min-w-40 flex ">
            <div className="w-1/2 text-center">Quantity</div>
            <div className="w-1/2 text-center">Date</div>
          </div>

          <div className="w-1/4  min-w-40 flex ">
            <div className="w-1/2 text-center">Quantity</div>
            <div className="w-1/2 text-center">Date</div>
          </div>

          <div className="w-1/4 min-w-40 text-center">{""}</div>
        </div>
      </div>

      {tableData.map((row, index) => (
        <div key={row.sr} className="flex text-[14px]">
          <div className="w-[70px] flex border-[#B5CEE1] border bg-[#F4FAFF] items-center justify-center">
            {row.sr}
          </div>
          <div className="border-[#B5CEE1]  py-4 px-4 flex-1 border flex justify-between">
            <div className="w-1/4 min-w-40 flex justify-around gap-4">
              <div>{row.required.quantity}</div>
              <div>{row.required.date}</div>
            </div>

            <div className="w-1/4 flex justify-around gap-4">
              <div>{row.required.quantity}</div>
              <div>{row.required.date}</div>
            </div>
            <div className="w-1/4 flex justify-around gap-4">
              <div>{row.required.quantity}</div>
              <div>{row.required.date}</div>
            </div>

            <div className="w-1/4 text-center">{row.agingDelay}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

