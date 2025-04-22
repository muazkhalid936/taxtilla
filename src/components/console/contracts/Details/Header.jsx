import React from 'react'

const Header = () => {
  return (
    <div>
    <div className="flex justify-center flex-col my-4 items-center">
      <p className="text-3xl font-bold">Yales Sales Contract</p>
      <p className="text-center">Customer Contract</p>
    </div>

    <p className="absolute right-10 top-0 font-bold  text-2xl "> LOGO</p>

    <div className="mt-10">
      <div className="flex justify-between items-center">
        <div className="w-1/2 flex">
          {" "}
          <p className="font-bold w-[200px] text-black ">
            Contract Date:{" "}
          </p>{" "}
          <p className="text-gray-500">29-May-2024</p>
        </div>
        <p className="text-gray-500 w-1/2">
          233-B, First Floor, Tulip Block, Sector C, Bahria Town
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-1/2 flex">
          {" "}
          <p className="font-bold w-[200px] text-black ">
            Contract No:{" "}
          </p>{" "}
          <p className="text-gray-500">NT-100-12</p>
        </div>

        <div className="w-1/2 flex justify-between  items-center">
          <p>NTN: 2370313-0</p>

          <p className="pr-10">
            <span className="font-bold text-black mr-2">GST:</span>
            03-00-9800-067-91
          </p>
        </div>
      </div>
    </div>
  </div>
)
}

export default Header