import React from "react";

const CustomSwitch = ({
  checked,
  onChange,
  label,
  id,
  onColor = "bg-blue-600",
  offColor = "bg-gray-300",
  fullWidth = false,
}) => {
  return (
    <div className="flex items-center gap-3 ">
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium text-gray-700 ${
            fullWidth ? "w-full" : ""
          }`}
        >
          {label}
        </label>
      )}
      <div
        id={id}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={`relative w-10 h-5 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
          checked ? onColor : offColor
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
};

export default CustomSwitch;
