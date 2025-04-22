const InputBox = ({ title, placeholder, smallWidth, type }) => {
  return (
    <div
      className={`relative min-w-[300px] max-w-[400px] ${smallWidth === true ? "w-[15vw]" : smallWidth === "20vw" ? "20vw" : "w-[25vw]"}  my-2`}
    >
      <label
        htmlFor="contractNo"
        className="absolute text-xs -top-2 left-4 bg-white px-1 text-gray-700 "
      >
        {title}{" "}
      </label>
      <input
        id="contractNo"
        type={type ? type : "text"}
        placeholder={placeholder}
        className="w-full py-3 px-2  text-[14px] border border-gray-700 rounded-md outline-none"
      />
    </div>
  );
};

export default InputBox;

