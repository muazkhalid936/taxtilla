const DropDown = ({ title, options, smallWidth }) => {
    return (
      <div
        className={`relative min-w-[300px] max-w-[400px] ${smallWidth === true ? "w-[15vw]" : smallWidth === "20vw" ? "20vw" : "w-[25vw]"}  my-2`}
      >
        <label
          htmlFor="dropdown"
          className="absolute text-xs -top-2 left-4 bg-white px-1 text-gray-700 "
        >
          {title}{" "}
        </label>
        <select
          id="dropdown"
          className="w-full py-3 px-2 text-[14px] border border-gray-700 rounded-md outline-none"
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}  hidden={option.hidden} selected={option.selected} >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default DropDown;

