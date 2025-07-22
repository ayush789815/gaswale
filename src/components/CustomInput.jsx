import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

export const CustomInput = ({
  label,
  type = "text",
  value,
  onChange,
  name,
  placeholder,
  leftIcon,
  rightIcon,
  readOnly = false,
  disabled = false,
  error = "",
  className = "", // custom class from parent
  required = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && !showPassword ? "password" : "text";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-600 text-lg ml-1">*</span>}
        </label>
      )}
      <div
        className={`h-10 flex items-center border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md px-3 py-2   ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }
        ${
          readOnly
            ? "bg-gray-100"
            : "focus-within:ring-2 focus-within:ring-[#169e49] "
        }`}
      >
        {leftIcon && <div className="mr-2 text-gray-400">{leftIcon}</div>}
        <input
          type={isPassword ? inputType : type}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          tabIndex={readOnly ? -1 : 0}
          className={`flex-1 outline-none bg-transparent text-sm ${
            disabled ? "text-gray-500 bg-[#9ca3af]" : "text-gray-900"
          } ${readOnly ? "cursor-default" : ""}`}
          {...props}
        />
        {/* Password toggle */}
        {isPassword && !disabled && !readOnly && (
          <div
            className="ml-2 cursor-pointer text-gray-400"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
          </div>
        )}
        {rightIcon && !isPassword && (
          <div className="ml-2 text-gray-400">{rightIcon}</div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
