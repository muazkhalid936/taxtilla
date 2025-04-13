const InputBox = ({title,placeholder}) => {
    return (
      <div className="relative w-[25vw] my-2">
        <label
          htmlFor="contractNo"
          className="absolute text-xs -top-2 left-4 bg-white px-1 text-gray-700 "
        >
{title}        </label>
        <input
          id="contractNo"
          type="text"
          placeholder="Enter here"
          className="w-full py-4 px-2  text-[14px] border border-gray-700 rounded-md outline-none"
        />
      </div>
    );
  };
  
  export default InputBox;
  