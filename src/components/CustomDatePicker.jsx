const CustomDatePicker = ({
  label,
  value,
  onChange,
  name,
  placeholder,
  readOnly = false,
  disabled = false,
  error = "",
  className = "", // optional extra classes
  required = false,
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-600 text-lg ml-1">*</span>}
        </label>
      )}
      <div
        className={`h-10 flex items-center border px-3 py-2 rounded-md
        ${error ? "border-red-500" : "border-gray-300"}
        ${
          readOnly
            ? "bg-gray-100"
            : "bg-white focus-within:ring-2 focus-within:ring-blue-500"
        }
        ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      >
        <input
          type="date"
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          className={`flex-1 outline-none bg-transparent text-sm 
            ${disabled ? "text-gray-500" : "text-gray-900"} 
            ${readOnly ? "cursor-default" : ""}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
export default CustomDatePicker;
// import React from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const CustomDatePicker = ({
//   label,
//   selected,
//   onChange,
//   name,
//   placeholder,
//   readOnly = false,
//   disabled = false,
//   error = "",
//   className = "",
//   type = "date", // 'date' | 'time' | 'datetime'
//   leftIcon,
//   rightIcon,
//   dateFormat,
//   ...props
// }) => {
//   const isDateTime = type === "datetime";
//   const isTimeOnly = type === "time";

//   return (
//     <div className={`w-full ${className}`}>
//       {label && (
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//         </label>
//       )}
//       {/* <div
//         className={`h-10 flex w-full items-center border ${
//           error ? "border-red-500" : "border-gray-300"
//         } rounded-md
//         ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
//         ${
//           readOnly
//             ? "bg-gray-100"
//             : "focus-within:ring-2 focus-within:ring-blue-500 bg-white"
//         }`}
//       > */}
//       <div className={`w-full ${className}`}>
//         <div className="flex items-center w-full">
//           {/* {leftIcon && <div className="ml-3 text-gray-400">{leftIcon}</div>} */}
//           <DatePicker
//             selected={selected}
//             onChange={onChange}
//             name={name}
//             showTimeSelect={isDateTime || isTimeOnly}
//             showTimeSelectOnly={isTimeOnly}
//             timeIntervals={15}
//             timeCaption="Time"
//             dateFormat={
//               dateFormat ||
//               (isTimeOnly
//                 ? "h:mm aa"
//                 : isDateTime
//                 ? "yyyy-MM-dd h:mm aa"
//                 : "yyyy-MM-dd")
//             }
//             placeholderText={placeholder}
//             className="flex-1 w-full outline-none text-sm px-3 py-1  bg-black"
//             disabled={disabled}
//             readOnly={readOnly}
//             {...props}
//           />
//           {/* {rightIcon && <div className="mr-3 text-gray-400">{rightIcon}</div>} */}
//         </div>
//       </div>
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };

// export default CustomDatePicker;

// // import React from "react";
// // import DatePicker from "react-datepicker";
// // import { Calendar, Clock } from "lucide-react";
// // import "react-datepicker/dist/react-datepicker.css";

// // const CustomDatePicker = ({
// //   label,
// //   selected,
// //   onChange,
// //   name,
// //   placeholder,
// //   readOnly = false,
// //   disabled = false,
// //   error = "",
// //   className = "",
// //   type = "date", // 'date' | 'time' | 'datetime'
// //   leftIcon,
// //   rightIcon,
// //   showTimeSelect = false,
// //   dateFormat,
// //   ...props
// // }) => {
// //   const isDateTime = type === "datetime";
// //   const isTimeOnly = type === "time";

// //   return (
// //     <div className={`w-full ${className}`}>
// //       {label && (
// //         <label className="block text-sm font-medium text-gray-700 mb-1">
// //           {label}
// //         </label>
// //       )}
// //       <div
// //         className={`h-10 flex w-full items-center border bg-amber-300 ${
// //           error ? "border-red-500" : "border-gray-300"
// //         } rounded-md
// //         ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
// //         ${
// //           readOnly
// //             ? "bg-gray-100"
// //             : "focus-within:ring-2 focus-within:ring-blue-500 "
// //         }`}
// //       >
// //         {leftIcon && <div className="mr-2 text-gray-400">{leftIcon}</div>}
// //         <DatePicker
// //           selected={selected}
// //           onChange={onChange}
// //           name={name}
// //           showTimeSelect={isDateTime || isTimeOnly}
// //           showTimeSelectOnly={isTimeOnly}
// //           timeIntervals={15}
// //           timeCaption="Time"
// //           dateFormat={
// //             dateFormat ||
// //             (isTimeOnly
// //               ? "h:mm aa"
// //               : isDateTime
// //               ? "yyyy-MM-dd h:mm aa"
// //               : "yyyy-MM-dd")
// //           }
// //           placeholderText={placeholder}
// //           className="flex flex-1/2  min-w-full outline-none px-3 py-2 text-sm w-full bg-black"
// //           disabled={disabled}
// //           readOnly={readOnly}
// //           {...props}
// //         />
// //         {/* {!rightIcon &&
// //           (isTimeOnly ? (
// //             <Clock size={20} className="text-gray-400 ml-2" />
// //           ) : (
// //             <Calendar size={20} className="text-gray-400 ml-2" />
// //           ))} */}
// //         {/* {rightIcon && <div className="ml-2 text-gray-400">{rightIcon}</div>} */}
// //       </div>
// //       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
// //     </div>
// //   );
// // };

// // export default CustomDatePicker;
