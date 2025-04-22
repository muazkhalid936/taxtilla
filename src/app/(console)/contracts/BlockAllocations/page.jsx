import React from "react";
import { CirclePlus } from "lucide-react";

import InputBox from "../../../../components/common/InputBox";

const page = () => {
  return (
    <div className="min-h-[80vh] relative">
      <div className="flex justify-between items-center">
        <p className="font-bold ">Block Booking Allocation</p>

        <button className="px-8 py-2 bg-black text-white rounded-lg transition">
          Add{" "}
        </button>
      </div>

      <div>
        <p className="font-medium">2nd Allocation</p>
        <p className=" flex gap-2 items-center text-gray-500">
          Add specification here <CirclePlus className="text-sm" />{" "}
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <InputBox
            title="PPC"
            placeholder={"Enter PPC value here"}
            smallWidth={true}
          />
          <InputBox
            title="Quantity"
            placeholder={"Enter Quantity"}
            smallWidth={true}
          />
          <InputBox
            title=" Rate"
            placeholder={"Enter Rate"}
            smallWidth={true}
          />
          <InputBox
            title="Start Date"
            placeholder={"Start Date"}
            smallWidth={true}
          />
          <InputBox
            title="End Date"
            placeholder={"End Date"}
            smallWidth={true}
          />
          <InputBox
            title=" Certificate"
            placeholder={"Enter Certificate"}
            smallWidth={true}
          />
          <InputBox
            title="Cone Weight"
            placeholder={"Enter Cone Weight"}
            smallWidth={true}
          />
        </div>
      </div>
      <div>
        <p className="font-medium">First Placement</p>
        <p className=" flex gap-2 items-center text-gray-500">
          Add specification here <CirclePlus className="text-sm" />{" "}
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <InputBox
            title="PPC"
            placeholder={"Enter PPC value here"}
            smallWidth={true}
          />
          <InputBox
            title="Quantity"
            placeholder={"Enter Quantity"}
            smallWidth={true}
          />
          <InputBox
            title=" Rate"
            placeholder={"Enter Rate"}
            smallWidth={true}
          />
          <InputBox
            title="Start Date"
            placeholder={"Start Date"}
            smallWidth={true}
          />
          <InputBox
            title="End Date"
            placeholder={"End Date"}
            smallWidth={true}
          />
          <InputBox
            title=" Certificate"
            placeholder={"Enter Certificate"}
            smallWidth={true}
          />
          <InputBox
            title="Cone Weight"
            placeholder={"Enter Cone Weight"}
            smallWidth={true}
          />
        </div>
      </div>
      <div className="flex flex-1 items-end h-auto justify-end mt-10 w-[90%] mx-auto">
        <button className="px-8 py-2 absolute bottom-0 right-10 bg-black text-white rounded-lg transition">
          Submit Request{" "}
        </button>
      </div>
    </div>
  );
};

export default page;

