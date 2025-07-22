import React from "react";

const CustomRadioButton = ({
  label,
  name,
  value,
  checked,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="hidden"
      />
      <div
        className={`w-5 h-5 rounded-full border-2 border-[#169e49] flex items-center justify-center transition`}
      >
        {checked && <div className="w-3 h-3 rounded-full bg-[#169e49]" />}
      </div>
      <span className="text-sm text-gray-800">{label}</span>
    </label>
  );
};

export default CustomRadioButton;
