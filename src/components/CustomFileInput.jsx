import React from "react";

export const CustomFileInput = ({
  label,
  name,
  onChange,
  accept = "image/*",
  disabled = false,
  readOnly = false,
  error = "",
  className = "",
  fileName = "", // for controlled file display
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-800 mb-1">
          {label}
        </label>
      )}
      <div
        className={`flex h-10 items-center border rounded-md overflow-hidden px-0 ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
      >
        {/* Hidden file input */}
        <input
          type="file"
          id={name}
          name={name}
          onChange={onChange}
          accept={accept}
          disabled={disabled}
          readOnly={readOnly}
          className="hidden"
          {...props}
        />

        {/* Custom label as file picker button */}
        <label
          htmlFor={name}
          className={`bg-gray-100 px-4 py-2 text-sm cursor-pointer border-r border-gray-300 ${
            disabled || readOnly ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          Choose file
        </label>

        {/* File name display */}
        <span className="text-sm px-3 text-gray-700 truncate">
          {fileName || "No file chosen"}
        </span>
      </div>

      {/* Optional error */}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
