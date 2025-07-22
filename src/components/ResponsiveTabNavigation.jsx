// components/ResponsiveTabNavigation.jsx
import React from "react";
import { ChevronRight } from "lucide-react";

const ResponsiveTabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <>
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex w-[18%] flex-col gap-2 p-5 border-r border-r-gray-800/15">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`flex justify-between px-3 py-2 cursor-pointer text-md font-medium rounded-md items-center ${
              activeTab === tab
                ? "bg-[#216d13] text-white"
                : "bg-[#f0f5f2] text-[#169e49]"
            }`}
            onClick={() => onTabChange(tab)}
          >
            <p>{tab}</p>
            <ChevronRight size={20} />
          </div>
        ))}
      </div>

      {/* Top Scrollable Tab Bar for Mobile/Tablet */}
      <div className="md:hidden overflow-x-auto whitespace-nowrap border-b border-gray-200">
        <div className="flex gap-3 px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === tab
                  ? "bg-[#216d13] text-white"
                  : "bg-[#f0f5f2] text-[#169e49]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResponsiveTabNavigation;
