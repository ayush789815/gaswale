import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import PurchaseOrder from "./PurchaseOrder";
import ActiveOrders from "./ActiveOrders";
import OrderHistory from "./OrderHistory";
import Credit from "./Credit";
import Quotation from "./Quotation";
import Reports from "./Reports";
import Payment from "./Payment";


const tabs = [
  "Active Order",
  "Order History",
  "Quotation",
  "Purchase Order",
  "Reports",
  "Credit",
  "Payment",
];

const Dashboard = () => {
  const [itemLink, setItemLink] = useState("Active Order");

  const renderComponent = () => {
    switch (itemLink) {
      case "Active Order":
        return <ActiveOrders />;
      case "Order History":
        return <OrderHistory />;
      case "Reports":
        return <Reports />;
      case "Credit":
        return <Credit />;
      case "Quotation":
        return <Quotation />;
      case "Purchase Order":
        return <PurchaseOrder />;
      case "Payment":
        return <Payment />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[90%] mx-auto m-5">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex border border-gray-800/15 rounded-md">
        <div className="w-[16rem]  p-5 border-r border-gray-800/15">
          <ul className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`flex justify-between px-3 py-2 cursor-pointer text-md font-medium rounded-md items-center ${
                  itemLink === tab
                    ? "bg-[#216d13] text-white"
                    : "bg-[#f0f5f2] text-[#169e49]"
                }`}
                onClick={() => setItemLink(tab)}
              >
                <p>{tab}</p>
                <ChevronRight size={20} />
              </li>
            ))}
          </ul>
        </div>
        {/* <div className="p-5 flex w-full max-w-fit">{renderComponent()}</div> */}
        <div className="p-5 w-full overflow-x-auto">
          <div className="max-w-full">{renderComponent()}</div>
        </div>
      </div>

      {/* Top tab bar for mobile/tablet */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="overflow-x-auto border border-gray-300 rounded-md">
          <ul className="flex whitespace-nowrap">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  itemLink === tab
                    ? "bg-[#216d13] text-white"
                    : "bg-[#f0f5f2] text-[#169e49]"
                }`}
                onClick={() => setItemLink(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
        <div className="">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useState } from "react";

// import { ChevronRight } from "lucide-react";
// import PurchaseOrder from "./PurchaseOrder";
// import ActiveOrders from "./ActiveOrders";
// import OrderHistory from "./OrderHistory";
// import Credit from "./Credit";
// import Quotation from "./Quotation";
// import Reports from "./Reports";
// import Payment from "./Payment";

// const Dashboard = () => {
//   const [itemLink, setItemLink] = useState("Active Order");

//   return (
//     <div className="max-w-[90%] border border-gray-800/15 rounded-md flex mx-auto m-5">
//       {/* Left Sidebar Navigation */}
//       <div className="w-[18%] p-5 border-r border-r-gray-800/15">
//         <ul className="w-full flex flex-col gap-2">
//           <li
//             className={`flex justify-between px-3 py-2 cursor-pointer  text-md font-medium rounded-md items-center ${
//               itemLink === "Active Order"
//                 ? "bg-[#216d13] text-white"
//                 : "bg-[#f0f5f2] text-[#169e49]"
//             }`}
//             onClick={() => setItemLink("Active Order")}
//           >
//             <p>Active Order</p>
//             <ChevronRight size={20} />
//           </li>

//           <li
//             className={`flex justify-between px-3 py-2 cursor-pointer text-md font-medium rounded-md items-center ${
//               itemLink === "Order History"
//                 ? "bg-[#216d13] text-white"
//                 : "bg-[#f0f5f2] text-[#169e49]"
//             }`}
//             onClick={() => setItemLink("Order History")}
//           >
//             <p>Order History</p>
//             <ChevronRight size={20} />
//           </li>

//           <li
//             className={`flex justify-between px-3 py-2 cursor-pointer text-md font-medium rounded-md items-center ${
//               itemLink === "Reports"
//                 ? "bg-[#216d13] text-white"
//                 : "bg-[#f0f5f2] text-[#169e49]"
//             }`}
//             onClick={() => setItemLink("Reports")}
//           >
//             <p>Reports</p>
//             <ChevronRight size={20} />
//           </li>
//           <li
//             className={`flex justify-between px-3 py-2 cursor-pointer text-md font-medium rounded-md items-center ${
//               itemLink === "Credit"
//                 ? "bg-[#216d13] text-white"
//                 : "bg-[#f0f5f2] text-[#169e49]"
//             }`}
//             onClick={() => setItemLink("Credit")}
//           >
//             <p>Credit</p>
//             <ChevronRight size={20} />
//           </li>

//           <li
//             className={`flex justify-between px-3 py-2 cursor-pointer text-md font-medium rounded-md items-center ${
//               itemLink === "Quotation"
//                 ? "bg-[#216d13] text-white"
//                 : "bg-[#f0f5f2] text-[#169e49]"
//             }`}
//             onClick={() => setItemLink("Quotation")}
//           >
//             <p>Quotation</p>
//             <ChevronRight size={20} />
//           </li>

//           <li
//             className={`flex justify-between px-3 py-2 cursor-pointer text-md font-medium rounded-md items-center ${
//               itemLink === "Purchase Order"
//                 ? "bg-[#216d13] text-white"
//                 : "bg-[#f0f5f2] text-[#169e49]"
//             }`}
//             onClick={() => setItemLink("Purchase Order")}
//           >
//             <p>Purchase Order</p>
//             <ChevronRight size={20} />
//           </li>
//           <li
//             className={`flex justify-between px-3 py-2 cursor-pointer text-md font-medium rounded-md items-center ${
//               itemLink === "Payment"
//                 ? "bg-[#216d13] text-white"
//                 : "bg-[#f0f5f2] text-[#169e49]"
//             }`}
//             onClick={() => setItemLink("Payment")}
//           >
//             <p>Payment</p>
//             <ChevronRight size={20} />
//           </li>
//         </ul>
//       </div>

//       {/* Right Side Content */}
//       <div className="p-5 flex w-full">
//         {itemLink === "Active Order" && <ActiveOrders />}
//         {itemLink === "Order History" && <OrderHistory />}
//         {itemLink === "Reports" && <Reports />}
//         {itemLink === "Credit" && <Credit />}
//         {itemLink === "Quotation" && <Quotation />}
//         {itemLink === "Purchase Order" && <PurchaseOrder />}
//         {itemLink === "Payment" && <Payment />}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
