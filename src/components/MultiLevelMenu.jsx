import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuData = {
  Products: {
    LPG: ["All", "BPCL", "HPCL", "IOCL", "PMs"],
  },
};

const MultiLevelMenu = () => {
  const navigate = useNavigate();
  const [hoveredMain, setHoveredMain] = useState(null);
  const [hoveredSub, setHoveredSub] = useState(null);
  const handleClick = (id) => {
    navigate(`/products/${id}`);
  };
  return (
    <div className="text-white flex relative">
      {Object.keys(menuData).map((main) => (
        <div
          key={main}
          className="relative gap-2"
          onMouseEnter={() => setHoveredMain(main)}
          onMouseLeave={() => {
            setHoveredMain(null);
            setHoveredSub(null);
          }}
        >
          <button className="text-white max-w-[150px] px-2 rounded-md text-sm font-medium flex gap-5 py-4">
            {main}
          </button>

          {/* Submenu (e.g., LPG, Other Product) */}
          {hoveredMain === main && (
            <div className="absolute top-full left-0 bg-white text-black shadow-lg rounded-md min-w-[100px]over z-50">
              {Object.keys(menuData[main]).map((sub) => (
                <div
                  key={sub}
                  className="relative px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onMouseEnter={() => setHoveredSub(sub)}
                >
                  {sub}

                  {/* Nested submenu (e.g., BPCL, HPCL) */}
                  {hoveredSub === sub && (
                    <div className="absolute top-0 left-full bg-white text-black shadow-lg rounded-md min-w-[100px] z-50">
                      {menuData[main][sub].map((item) => (
                        <div
                          onClick={() => handleClick(item)}
                          key={item}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-md"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MultiLevelMenu;
