import React, { useState } from "react";
import { Link } from "react-router-dom";

// Reusable Menu Wrapper
export const MenuWrapper = ({ children, position }) => (
  <div
    className="absolute z-50 bg-[#333] text-white rounded-md shadow-md min-w-[200px] px-4 py-2"
    style={position}
  >
    <ul>{children}</ul>
  </div>
);

// Reusable Menu Item
export const MenuItem = ({ title, to, onClick }) => (
  <li className="hover:bg-gray-700 px-2 py-1 rounded cursor-pointer">
    <Link to={to} onClick={onClick} className="block w-full">
      {title}
    </Link>
  </li>
);

// Main Menu Component
const MenuBar = ({ menuItems = {} }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <div className="relative flex gap-6">
      {Object.entries(menuItems).map(([mainTitle, subItems]) => {
        const uniqueSubItems = [...new Set(subItems)];

        return (
          <div
            key={mainTitle}
            className="relative"
            onMouseEnter={() => setActiveMenu(mainTitle)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className="text-white font-medium px-4 py-2 hover:bg-gray-800 rounded">
              {mainTitle}
            </button>

            {activeMenu === mainTitle && uniqueSubItems.length > 0 && (
              <MenuWrapper position={{ top: "100%", left: 0 }}>
                {uniqueSubItems.map((label, idx) => (
                  <MenuItem
                    key={idx}
                    title={label}
                    to={`/${mainTitle.toLowerCase()}/${label
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  />
                ))}
              </MenuWrapper>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MenuBar;
