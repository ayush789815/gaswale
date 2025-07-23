import React, { useState } from "react";
import { Eye, FileText, Star, Repeat } from "lucide-react";
import { useGetOrdersListQuery, useCreateFeedbackMutation } from "../../store/services";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { IconLoader } from "../../components/PageLoader";
import FeedbackModal from "../../components/FeedbackModal";

const ActiveOrders = () => {
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");
  const userData = JSON.parse(localStorage.getItem("customer"));

  // Feedback state
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [rating, setRating] = useState(0);
  const [fbtext, setFbtext] = useState("");

  const { data, isLoading, isError } = useGetOrdersListQuery(
    {
      userid: userData?.userid,
      page: currentPage,
      limit: entriesPerPage,
      type: 1,
    },
    { refetchOnMountOrArgChange: true }
  );
  const [send_feedback] = useCreateFeedbackMutation();

  const totalCount = data?.totalcount || 0;
  const ordersData = data?.orders || [];

  const filteredOrders = ordersData.filter((order) =>
    order.orderid?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / entriesPerPage);

  const handleClick = (id) => {
    navigate(`/order-detail/${encodeURIComponent(id)}`);
  };

  const handlereorder = async (orderid) => {
    try {
      setLoading(orderid);
      const body = new FormData();
      body.append("userid", userData.userid);
      body.append("orderid", orderid);
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
    <div className="p-2 sm:p-4 w-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
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
              setCurrentPage(1);
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
            setCurrentPage(1);
          }}
        />
      </div>

      <p className="text-gray-600 mb-3 font-medium">
        Total Active Orders - {totalCount}
      </p>

      {/* Cards */}
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error fetching orders.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* ^^^ Responsive grid: 1 col on mobile, 2 on sm, 3 on md, 4 on lg */}
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-3 sm:p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              <p className="text-xs text-gray-500 mb-1">Order</p>
              <p className="font-semibold mb-2 break-all">#{order.orderid}</p>
              <p className="text-xs text-gray-500 mb-1">Date</p>
              <p className="font-medium mb-2">{order.datetime}</p>
              <p className="text-xs text-gray-500 mb-1">Order Status</p>
              <p className="font-semibold text-black mb-2">
                {order.orderstatustext}
              </p>
              <p className="text-xs text-gray-500 mb-1">Payment Mode</p>
              <p className="font-medium text-black mb-2">{order.paymentmode}</p>
              <hr className="my-3 border-gray-200" />
              <div className="flex justify-between items-center gap-2 flex-wrap">
                <Eye
                  className="text-green-500 cursor-pointer"
                  onClick={() => handleClick(order.orderid)}
                />
                {loading === order.orderid ? (
                  <IconLoader />
                ) : (
                  <Repeat
                    className="text-blue-800 cursor-pointer"
                    onClick={() => handlereorder(order?.orderid)}
                  />
                )}
                <FileText
                  className="text-red-300 cursor-pointer"
                  // onClick={() => handlePDFDownLoad(order?.orderid)}
                />
                <div
                  className="flex items-center gap-1 text-yellow-500 cursor-pointer"
                  onClick={() => {
                    setSelectedOrderId(order?.orderid);
                    setRating(order?.rating || 0);
                    setFbtext("");
                    setFeedbackModalOpen(true);
                  }}
                >
                  <Star fill="currentColor" stroke="currentColor" size={23} />
                  <span className="text-black text-lg sm:text-xl">{order.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 flex-wrap gap-3">
          <div className="flex gap-1 overflow-x-auto flex-nowrap">
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
  );
};

export default ActiveOrders;