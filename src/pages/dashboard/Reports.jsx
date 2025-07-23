import React, { useEffect, useState } from "react";
import { addMonths } from "date-fns";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  useGetReportsMutation,
  useGetProductListQuery,
} from "../../store/services";
// import { useGetProductListQuery } from "../../store/cartApi";

import {  formatPrice } from "../../utils/utils";
import CustomDropdown from "../../components/CustomDropdown";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import { ContentLoader } from "../../components/PageLoader";

const Reports = () => {
  // const [startDate, setStartDate] = useState(new Date("2025-05-20"));
  // const [endDate, setEndDate] = useState(new Date("2025-06-19"));
  // const [serviceType, setServiceType] = useState("all");
  
  const [productType, setProductType] = useState("all");
  const [paymentType, setPaymentType] = useState("all");

 const [range, setRange] = useState({
  startDate: addMonths(new Date(), -1),
  endDate: new Date(), // 1 month from today
});
  const userData = JSON.parse(localStorage.getItem("customer"));

  const [getReports, { data, isLoading }] = useGetReportsMutation();
  console.log("Reports Data:", data);

  const {
    data: productListData,
    isLoading: isProductListLoading,
    error: productListError,
  } = useGetProductListQuery({
    userid: userData.userid || "",
  });

  // console.log("Product List Data:", productListData);

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getReports({
      userid: userData?.userid || "",
      sdate: format(range?.startDate, "yyyy-MM-dd"),
      edate: format(range?.endDate, "yyyy-MM-dd"),
      // stype: serviceType,
      ptype: paymentType,
      ctype: productType, 
    });
  }, [range, paymentType, productType]);

  const reports = data?.data || [];
  // console.log(reports);
  const filtered = reports.filter((item) =>
    item.orderid.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / entriesPerPage);
  const currentReports = filtered?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );
  if (isLoading) {
    return <ContentLoader />;
  }
  return (
    <div className="w-full px-2 sm:px-4">
      <div className="border border-gray-200 p-3 sm:p-4 rounded-md mb-4">
        <p className="mb-3 font-medium">Filter By</p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <CustomDropdown
            label={"Product Type"}
            value={productType}
            onChange={(e) => { 
              console.log("Selected Product Type:", e.value); // Add this
              setProductType(e.value)}}
            options={[
              { value: "all", label: "All" },
              ...(productListData?.data || []).map((product) => ({
                value: product.uuid,
                label: `${product.type} ${product.description}`,
              })),
            ]}
          />

          <CustomDropdown
            label={"Payment Mode"}
            value={paymentType}
            onChange={(e) => setPaymentType(e.value)}
            options={[
              { value: "all", label: "All" },
              { value: "PO", label: "PO" },
              { value: "COD", label: "COD" },
              { value: "Credit", label: "Credit" },
              { value: "Net Banking", label: "Net Banking" },
              { value: "UPI", label: "UPI" },
            ]}
          />
          <div className="sm:col-span-2 lg:col-span-1">
            <CustomDateRangePicker
              startDate={range.startDate}
              endDate={range.endDate}
              onChange={(r) => setRange(r)}
            />
          </div>
        </div>
      </div>

      <p className="font-semibold mb-3 px-1">Total Orders: {filtered.length}</p>
      
      {/* Controls Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-sm whitespace-nowrap">Show</label>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 text-sm rounded min-w-0"
          >
            {[10, 20, 50].map((num) => (
              <option key={num}>{num}</option>
            ))}
          </select>
          <span className="text-sm whitespace-nowrap">entries</span>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border px-3 py-2 rounded w-full sm:w-52 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full border-collapse bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="text-left border-b bg-gray-50">
              <th className="p-3 font-semibold text-gray-700">Order ID</th>
              <th className="p-3 font-semibold text-gray-700">Payment Mode</th>
              <th className="p-3 font-semibold text-gray-700">Order Status</th>
              <th className="p-3 font-semibold text-gray-700">Products</th>
              <th className="p-3 font-semibold text-gray-700">Total Price</th>
              <th className="p-3 font-semibold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentReports?.map((order, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3">{order.orderid}</td>
                <td className="p-3 text-green-500">{order.paymentmode}</td>
                <td className="p-3">{order.orderstatustext}</td>
                <td className="p-3 whitespace-pre-wrap">
                  {order?.productslist ? (
                    order.productslist.split(",").map((productStr, i) => {
                      const [name, qty, price] = productStr.split("~~~");
                      return (
                        <div key={i} className="mb-1 last:mb-0">
                          {name} ({qty} - {formatPrice(price)})
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-400 italic">No products</div>
                  )}
                </td>
                <td className="p-3 font-semibold">{formatPrice(order.totalamount)}</td>
                <td className="p-3 text-sm text-gray-600">{order.datetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card Layout */}
      <div className="lg:hidden space-y-4">
        {currentReports?.map((order, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">#{order.orderid}</h3>
                <p className="text-sm text-gray-600">{order.datetime}</p>
              </div>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {order.orderstatustext}
              </span>
            </div>
            
            <div className="space-y-2 mb-3">
                <div className="border-t pt-3">
              <p className="text-sm text-gray-600 mb-2">Products:</p>
              <div className="text-sm">
                {order?.productslist ? (
                  order.productslist.split(",").map((productStr, i) => {
                    const [name, qty, price] = productStr.split("~~~");
                    return (
                      <div key={i} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-800">{name}</span>
                        <span className="text-gray-600">({qty} - {formatPrice(price)})</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-400 italic">No products</div>
                )}
              </div>
            </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment:</span>
                <span className="text-sm font-medium">{order.paymentmode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total:</span>
                <span className="text-sm font-semibold text-green-600">{formatPrice(order.totalamount)}</span>
              </div>
            </div>
            
          
          </div>
        ))}
      </div>

      {/* Responsive Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-gray-600 text-center sm:text-left">
          Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
          {Math.min(currentPage * entriesPerPage, filtered.length)} of{" "}
          {filtered.length} entries
        </p>
        
        <div className="flex justify-center sm:justify-end">
          <div className="flex gap-1 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            {/* Show fewer page numbers on mobile */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 border rounded text-sm transition-colors ${
                  currentPage === i + 1
                    ? "bg-[#169e49] text-white border-[#169e49]"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            )).slice(
              Math.max(0, currentPage - (window.innerWidth < 640 ? 1 : 2)),
              Math.min(currentPage + (window.innerWidth < 640 ? 1 : 2), totalPages)
            )}
            
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;