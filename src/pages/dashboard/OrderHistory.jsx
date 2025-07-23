import React, { useState } from "react";
import { Eye, FileText, MessageSquareText,Star, Repeat } from "lucide-react";
import { useGetOrdersListQuery,useCreateFeedbackMutation } from "../../store/services";
import { useNavigate } from "react-router-dom";
import { ContentLoader } from "../../components/PageLoader";
import { toast } from "react-toastify";
import axios from "axios";
import { handlePDFDownLoad } from "../../utils/utils";
  import { IconLoader } from "../../components/PageLoader";
import FeedbackModal from "../../components/FeedbackModal";

const OrderHistory = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");
  const userData = JSON.parse(localStorage.getItem("customer"));
  const navigate = useNavigate();
  // ✅ Feedback state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState("");
    const [rating, setRating] = useState(0);
    const [fbtext, setFbtext] = useState("");

  const { data, isLoading,isError } = useGetOrdersListQuery(
    {
      userid: userData?.userid,
      page: currentPage,
      limit: entriesPerPage,
      // type: 1,
    },
    { refetchOnMountOrArgChange: true }
  );
    const [send_feedback] = useCreateFeedbackMutation();
  
// console.log("data", data);
  const ordersData = data?.orders || [];
  const totalOrders = data?.totalcount || 0;
console.log("ordersData", ordersData);
  // useEffect(() => {
  //   const start = (currentPage - 1) * entriesPerPage;
  //   const end = start + entriesPerPage;
  //   setFilteredOrders(ordersData.slice(start, end));
  // }, [ordersData, entriesPerPage, currentPage]);

  const totalPages = Math.ceil(totalOrders / entriesPerPage);

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };
  if (isLoading) {
    return <ContentLoader />;
  }
  const handleClick = (id) => {
    // navigate(`/order-detail/${id}`);
    navigate(`/order-detail/${encodeURIComponent(id)}`);
  };
 const handlereorder = async (orderid) => {  
     try {
       setLoading(orderid);
       const body = new FormData();
       body.append("userid", userData.userid);
       body.append("orderid", orderid);
       // reorder
       const res = await axios.post(
         import.meta.env.VITE_API_BASE_URL + "customer/reorder",
         body,
         {
           headers: {
             "Content-Type": "multipart/form-data",
           },
         }
       );
       const response = await res.data;
 
       if (response.success) {
         toast.success(response.message);
 
         navigate("/cart");
       } else {
         toast.error(response.message);
       }
     } catch (error) {
       console.error("Error reordering:", error);
     } finally {
       setLoading("");
     }
   };
  const filteredOrders = ordersData
  .filter((order) => order.orderstatus === "4") // Filter by orderstatus = 4
  .filter((order) =>
    order.orderid?.toLowerCase().includes(search.toLowerCase())
  );
 const handleFeedbackSubmit = async () => {
  const response = await send_feedback({
    userid: userData?.userid,
    orderid: selectedOrderId,
    fbstatus: rating,
    fbtext: fbtext,
  });

  if (response?.data?.success) {
    toast.success("Feedback submitted!");
    setFeedbackModalOpen(false);
  } else {
    toast.error(response?.error?.data?.message || "Failed to submit feedback");
  }
};
  return (
    <div className="p-4 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm font-medium">
            Show
          </label>
          <select
            id="entries"
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset page when changing limit
            }}
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num}>{num}</option>
            ))}
          </select>
          <span className="text-sm">Entries</span>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset page on search
          }}
        />
      </div>
      <p className="text-gray-600 mb-3 font-medium">
        Previous Orders - {totalOrders} 
      </p>
            {/* Cards */}
       {isLoading ? (
        <p className="text-gray-500">Loading...</p>
       ) : isError ? (
        <p className="text-red-500">Error fetching orders.</p>
       ):(<div className="grid grid-cols- sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 mb-1">Order</p>
            <p className="font-semibold mb-2">{order.orderid}</p>
            <p className="text-sm text-gray-500 mb-1">Date</p>
            <p className="font-medium mb-2">{order.datetime}</p>
            <p className="text-sm text-gray-500 mb-1">Order Status</p>
            <p className="font-semibold text-black mb-2">
              {order.orderstatustext}
            </p>
            <p className="text-sm text-gray-500 mb-1">Payment Mode</p>
            <p className="font-medium text-black mb-2">{order.paymentmode}</p>
            <hr className="my-3 border-gray-200" />
            <div className="flex justify-between items-center">
              <Eye
                className="text-green-500 cursor-pointer"
                onClick={() => handleClick(order.orderid)}
              />
              {loading == order.orderid ? (
                <IconLoader />
              ) : (
                <Repeat
                  className="text-blue-800 cursor-pointer"
                  onClick={() => handlereorder(order?.orderid)}
                />
              )}
              <FileText
                className="text-red-500 cursor-pointer"
                onClick={() => handlePDFDownLoad(order?.orderid)}
              />
                <div className="flex items-center gap-1 text-yellow-500 cursor-pointer" 
               onClick={() => {
                    setSelectedOrderId(order?.orderid);
                    setRating(order?.rating || 0);
                    setFbtext("");
                    setFeedbackModalOpen(true);
                  }}>
              <Star fill="currentColor" stroke="currentColor" size={23} />
                <span className="text-black text-xl">{order.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                
                {i + 1}
              </button>
            )).slice(
              Math.max(0, currentPage - 2),
              Math.min(currentPage + 2, totalPages)
            )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
      <FeedbackModal 
     isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
        rating={rating}
        setRating={setRating}
        fbtext={fbtext}
        setFbtext={setFbtext}
        />
    </div>
    // <div className="w-full  flex flex-col">
    //   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
    //     <div className="flex items-center gap-2">
    //       <label htmlFor="entries">Show</label>
    //       <select
    //         id="entries"
    //         className="border border-gray-300 px-2 py-1 rounded-md"
    //         value={entriesPerPage}
    //         onChange={(e) => {
    //           setEntriesPerPage(Number(e.target.value));
    //           setCurrentPage(1);
    //         }}
    //       >
    //         {[10, 25, 50].map((n) => (
    //           <option key={n} value={n}>
    //             {n}
    //           </option>
    //         ))}
    //       </select>
    //       <span>Entries</span>
    //     </div>

    //   </div>

    //   <div className="mb-2">
    //     <span className="font-medium text-lg">
    //       Previous Orders - {totalOrders}
    //     </span>
    //   </div>

    //   {/* Conditional Rendering */}
    //   <div className="overflow-x-auto max-w-max">
    //     <table className="min-w-full border-collapse">
    //       <thead className="bg-gray-100">
    //         <tr>
    //           <th className="px-4 py-3 text-left">Order ID</th>
    //           <th className="px-4 py-3 text-left">Date</th>
    //           <th className="px-4 py-3 text-left">Order Status</th>
    //           <th className="px-4 py-3 text-left">Payment Mode</th>
    //           <th className="px-4 py-3 text-left">Amount</th>
    //           <th className="px-4 py-3 text-left">Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {ordersData.map((order, idx) => (
    //           <tr
    //             key={idx}
    //             className="hover:bg-gray-50 border-b border-gray-200"
    //           >
    //             <td className="px-4 py-2 whitespace-nowrap">{order.orderid}</td>
    //             <td className="px-4 py-2 whitespace-nowrap">
    //               {order.datetime}
    //             </td>
    //             <td className="px-4 py-2 whitespace-nowrap">
    //               {order.orderstatustext}
    //             </td>
    //             <td className="px-4 py-2 whitespace-nowrap">
    //               {order.paymentmode}
    //             </td>
    //             <td className="px-4 py-2 whitespace-nowrap">
    //               {order.totalamount}
    //             </td>
    //             <td className="px-4 py-2 whitespace-nowrap">
    //               <div className="flex gap-3">
    //                 <Eye
    //                   className="text-blue-600 cursor-pointer"
    //                   onClick={() => handleClick(order.orderid)}
    //                 />
    //                 {loading == order.orderid ? (
    //                   <IconLoader />
    //                 ) : (
    //                   <Repeat
    //                     className="text-gray-800 cursor-pointer"
    //                     onClick={() => handlereorder(order?.orderid)}
    //                   />
    //                 )}
    //                  <FileText
    //               className="text-red-600 cursor-pointer"
    //               onClick={() => handlePDFDownLoad(order?.orderid)}
    //             />
    //                 <MessageSquareText
    //                   className="text-gray-600 cursor-pointer"
    //                   size={20}
    //                 />
    //               </div>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>

    //   {/* Pagination Controls */}
    //   <div className="flex justify-end gap-2 items-center mt-4">
    //     <button
    //       onClick={() => handlePageChange(currentPage - 1)}
    //       disabled={currentPage === 1}
    //       className="border px-3 py-1 rounded-md bg-white shadow text-sm disabled:opacity-50"
    //     >
    //       Previous
    //     </button>
    //     <div className="flex items-center gap-2">
    //       {Array.from({ length: totalPages }, (_, i) => (
    //         <button
    //           key={i + 1}
    //           onClick={() => handlePageChange(i + 1)}
    //           className={`px-3 py-1 rounded-md text-sm ${
    //             currentPage === i + 1
    //               ? "bg-blue-600 text-white"
    //               : "bg-white border"
    //           }`}
    //         >
    //           {i + 1}
    //         </button>
    //       ))}
    //     </div>
    //     <button
    //       onClick={() => handlePageChange(currentPage + 1)}
    //       disabled={currentPage === totalPages}
    //       className="border px-3 py-1 rounded-md bg-white shadow text-sm disabled:opacity-50"
    //     >
    //       Next
    //     </button>
    //   </div>
    // </div>
  );
};

export default OrderHistory;
