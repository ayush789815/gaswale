import React from "react";
import { Loader2 } from "lucide-react";

const CustomButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  variant = "primary", // "primary" or "secondary"
  className = "",
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const baseClasses =
    "inline-flex items-center justify-center px-5 py-2 rounded-md font-medium transition-all duration-200";
  const primaryClasses = isDisabled
    ? "bg-gray-300 text-white cursor-not-allowed"
    : "bg-[#169e49] hover:bg-[#12833d] hover:text-white";
  const secondaryClasses = isDisabled
    ? "bg-gray-500 text-gray-400 cursor-not-allowed"
    : "bg-[#6c757d] text-white hover:bg-[#6c757d] border border-gray-300";

  const finalClasses = `${baseClasses} ${
    variant === "secondary" ? secondaryClasses : primaryClasses
  } ${className}`;

  return (
    <button
      // type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={finalClasses}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export default CustomButton;
