import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ChevronDown } from "lucide-react";

const CustomDateRangePicker = ({
  label = "Filter by Date",
  startDate,
  endDate,
  onChange,
  className = "",
  readOnly = false,
  disabled = false,
  error = "",
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Local temporary state until "Done" is clicked
  const [tempRange, setTempRange] = useState({
    startDate,
    endDate,
    key: "selection",
  });

  const handleSelect = (ranges) => {
    setTempRange(ranges.selection); // Update temp only
  };

  const applyChanges = () => {
    onChange({
      startDate: tempRange.startDate,
      endDate: tempRange.endDate,
    });
    setShowPicker(false);
  };

  return (
    <div className={`w-full relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div
        // className="border px-3 py-2 rounded text-sm cursor-pointer bg-white shadow-sm flex items-center justify-between"

        className={`h-10 flex items-center border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md px-3 py-2   ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }
          ${
            readOnly
              ? "bg-gray-100"
              : "focus-within:ring-2 focus-within:ring-blue-500 bg-white"
          }`}
        onClick={() => {
          setTempRange({ startDate, endDate, key: "selection" });
          setShowPicker((prev) => !prev);
        }}
      >
        <span className="text-gray-700 flex-1">
          {`${format(startDate, "yyyy-MM-dd")} to ${format(
            endDate,
            "yyyy-MM-dd"
          )}`}
        </span>
        {/* <span className="text-[#169e49] font-semibold">▼</span> */}
        <ChevronDown className="text-gray-600  " />
      </div>

      {showPicker && (
        <div className="absolute z-50 mt-2 shadow-lg bg-white border border-gray-200 rounded">
          <DateRange
            ranges={[tempRange]}
            onChange={handleSelect}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            rangeColors={["#169e49"]}
          />
          <div className="flex justify-end px-3 pb-2">
            <button
              className="text-sm text-white bg-[#169e49] hover:bg-[#12833d] px-3 py-1 rounded"
              onClick={applyChanges}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDateRangePicker;
