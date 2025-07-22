import React from "react";
import clsx from "clsx";

const KeyValueItem = ({
  label,
  value,
  variant = "default",
  className = "",
}) => {
  if (variant === "value-only") {
    return (
      <div className={clsx("mb-2", className)}>
        <p className="text-md font-semibold text-black">{value}</p>
      </div>
    );
  }

  if (variant === "centered") {
    return (
      <div className={clsx("mb-2 flex items-center", className)}>
        <p className="text-sm text-gray-600 text-left bg-amber-200 flex-1">
          {label}
        </p>
        <p className="text-center">:</p>
        <p className="text-sm font-medium text-black text-right break-all bg-amber-100 flex-1">
          {value}
        </p>
      </div>
    );
  }
  if (variant === "between") {
    return (
      <div
        className={clsx("mb-1 flex items-center justify-between", className)}
      >
        <p className="text-[1rem] text-gray-600 flex-1 text-left">{label}</p>
        {/* <p className="text-center">:</p> */}
        <p className="text-[1rem] font-normal text-black break-all flex-1 text-left">
          {value}
        </p>
      </div>
    );
  }

  // Default layout
  return (
    <div className={clsx("mb-2 flex", className)}>
      <p className="text-sm text-gray-600">{label}:</p>
      <p className="ml-2 text-sm font-medium text-black break-all">{value}</p>
    </div>
  );
};

export default KeyValueItem;
