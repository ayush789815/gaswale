import React from "react";
import Select from "react-select";

const CustomDropdown = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  error,
  className = "",
  placeholder = "Select an option...",
  isDisabled = false,
  isMulti = false,
  isClearable = false,
  isSearchable = true,
  size = "default", // "small", "default", "large"
  required = false,
}) => {
  // Find the selected option object
  // const selectedValue =
  //   options?.find((option) => option.value == value) || null;
  const selectedValue = isMulti
    ? options?.filter((option) =>
        Array.isArray(value)
          ? value.includes(option.value) ||
            value.some((v) => v?.value === option.value)
          : false
      )
    : options?.find((option) => option.value == value) || null;

  // Size configurations
  const sizeConfig = {
    small: {
      minHeight: "32px",
      padding: "0px 6px",
      fontSize: "14px",
    },
    default: {
      minHeight: "36px",
      padding: "2px 8px",
      fontSize: "14px",
    },
    large: {
      minHeight: "44px",
      padding: "4px 12px",
      fontSize: "16px",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.default;

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
      borderRadius: "6px",
      padding: currentSize.padding,
      minHeight: currentSize.minHeight,
      fontSize: currentSize.fontSize,
      boxShadow: state.isFocused ? "0 0 0 2px #169e49" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#169e49" : "#9ca3af",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: size === "small" ? "0 6px" : "2px 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
      paddingBottom: "0",
      paddingTop: "0",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: size === "small" ? "none" : "block", // Hide separator for small size
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#6b7280",
      padding: size === "small" ? "4px" : "8px",
      "&:hover": {
        color: "#169e49",
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: size === "small" ? "4px" : "8px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: currentSize.fontSize,
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: currentSize.fontSize,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#169e49"
        : state.isFocused
        ? "#f0fdf4"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      padding: size === "small" ? "6px 12px" : "8px 12px",
      fontSize: currentSize.fontSize,
      "&:hover": {
        backgroundColor: state.isSelected ? "#169e49" : "#f0fdf4",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className={`${size === "small" ? "w-auto" : "w-full"} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-600 text-lg ml-1">*</span>}
        </label>
      )}

      <Select
        name={name}
        value={selectedValue}
        onChange={onChange}
        onBlur={onBlur}
        options={options}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isMulti={isMulti}
        isClearable={isClearable}
        isSearchable={isSearchable}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
      />

      {error && (
        <p
          className={`text-red-500 mt-1 ${
            size === "small" ? "text-xs" : "text-sm"
          }`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomDropdown;

// import React from "react";
// import Select from "react-select";

// const CustomDropdown = ({
//   label,
//   name,
//   value,
//   onChange,
//   onBlur,
//   options,
//   error,
//   className = "",
//   placeholder = "Select an option...",
//   isDisabled = false,
//   isMulti = false,
//   isClearable = false,
//   isSearchable = true,
// }) => {
//   console.log(value);

//   // Find the selected option object
//   const selectedValue = options.find((option) => option.value == value) || null;

//   // Handle change - convert back to simple value
//   //   const handleChange = (selectedOption) => {
//   //     if (onChange) {
//   //       // Create synthetic event object similar to regular select
//   //       const syntheticEvent = {
//   //         target: {
//   //           name: name,
//   //           value: selectedOption ? selectedOption.value : "",
//   //         },
//   //       };
//   //       onChange(syntheticEvent);
//   //     }
//   //   };

//   // Custom styles for react-select
//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       border: error ? "1px solid #ef4444" : "1px solid #d1d5db",
//       borderRadius: "6px",
//       padding: "2px 8px",
//       minHeight: "42px",
//       boxShadow: state.isFocused ? "0 0 0 2px #169e49" : "none",
//       "&:hover": {
//         borderColor: state.isFocused ? "#169e49" : "#9ca3af",
//       },
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       color: "#9ca3af",
//     }),
//     dropdownIndicator: (provided) => ({
//       ...provided,
//       color: "#6b7280",
//       "&:hover": {
//         color: "#169e49",
//       },
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected
//         ? "#169e49"
//         : state.isFocused
//         ? "#f0fdf4"
//         : "white",
//       color: state.isSelected ? "white" : "#374151",
//       "&:hover": {
//         backgroundColor: state.isSelected ? "#169e49" : "#f0fdf4",
//       },
//     }),
//     menu: (provided) => ({
//       ...provided,
//       zIndex: 9999,
//     }),
//   };

//   return (
//     <div className={`w-full ${className}`}>
//       {label && (
//         <label className="block mb-1 font-medium text-gray-700">{label}</label>
//       )}

//       <Select
//         name={name}
//         value={selectedValue}
//         onChange={onChange}
//         onBlur={onBlur}
//         options={options}
//         placeholder={placeholder}
//         isDisabled={isDisabled}
//         isMulti={isMulti}
//         isClearable={isClearable}
//         isSearchable={isSearchable}
//         styles={customStyles}
//         className="react-select-container"
//         classNamePrefix="react-select"
//       />

//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };

// export default CustomDropdown;

// import React from "react";
// import { ChevronDown } from "lucide-react";

// const CustomDropdown = ({
//   label,
//   name,
//   value,
//   onChange,
//   onBlur,
//   options,
//   error,
//   className = "",
//   placeholder = "",
// }) => {
//   return (
//     <div className={`w-full ${className}`}>
//       {label && <label className="block mb-1 font-medium">{label}</label>}
//       <div className="relative">
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           onBlur={onBlur}
//           className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#169e49] appearance-none bg-white cursor-pointer"
//         >
//           {placeholder && <option value="">{placeholder}</option>}
//           {options.map((opt) => (
//             <option key={opt.value} value={opt.value}>
//               {opt.label}
//             </option>
//           ))}
//         </select>

//         {/* Custom Down Arrow Icon */}
//         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//           <ChevronDown className="h-4 w-4 text-gray-400" />
//         </div>
//       </div>

//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };

// export default CustomDropdown;

// // import React from "react";

// // const CustomDropdown = ({
// //   label,
// //   name,
// //   value,
// //   onChange,
// //   onBlur,
// //   options,
// //   error,
// //   className = "",
// //   placeholder = "",
// // }) => {
// //   return (
// //     <div className={`w-full ${className}`}>
// //       {label && <label className="block mb-1 font-medium">{label}</label>}
// //       <select
// //         name={name}
// //         value={value}
// //         onChange={onChange}
// //         onBlur={onBlur}
// //         className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#169e49]"
// //       >
// //         {placeholder && <option value="">{placeholder}</option>}
// //         {options.map((opt) => (
// //           <option key={opt.value} value={opt.value}>
// //             {opt.label}
// //           </option>
// //         ))}
// //       </select>
// //       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
// //     </div>
// //   );
// // };

// // export default CustomDropdown;
