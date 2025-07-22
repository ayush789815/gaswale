import React, { useState } from "react";
import { useGetPaymentListQuery } from "../../store/services";
import CustomButton from "../../components/CustomButton";
import KeyValueItem from "../../components/KeyValueItem";
import { formatIndianPrice } from "../../utils/utils";
import AddPayemt from "./AddPayemt";
import { X } from "lucide-react";

const Payment = () => {
  const [addPayment, setAddPayment] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null); // for modal

  const userData = JSON.parse(localStorage.getItem("customer"));

  const { data, isLoading, isError, refetch } = useGetPaymentListQuery(
    {
      userid: userData?.userid,
      page: currentPage,
      limit: entriesPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );
  console.log(data)
  const paymentData = data?.data || [];
  console.log(paymentData)
  
  const filteredpayment = paymentData.filter((payment) =>
    payment?.sr_no?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCount = filteredpayment.length;
  const totalPages = Math.ceil(totalCount / entriesPerPage);

  // Check if there's no data at all
  const hasNoData = !isLoading && !isError && paymentData.length === 0;

  // Function to handle successful payment creation
  const handlePaymentSuccess = () => {
    setAddPayment(false);
    refetch(); // Refetch the payment list to show updated data
  };

  const getPaymentMode = (code) => {
    const map = {
      1: "Cash",
      2: "Cheque",
      3: "Online",
    };
    return map[code] || "N/A";
  };

  const getTransactionMode = (code) => {
    const map = {
      1: "PhonePe",
      2: "GPay",
      3: "Paytm",
      4: "Cred",
      5: "Others",
      6: "RTGS",
      7: "NEFT",
      8: "IMPS",
    };
    return map[code] || "N/A";
  };

  // Function to get order IDs from orders array
  const getOrderIds = (orders) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return "No orders";
    }
    return orders.map(order => order.orderid).join(", ");
  };

  return (
    <div className="p-4 w-full relative">
      <div className="flex gap-2 items-center justify-between mb-3">
        <p className="text-gray-600 font-medium text-xl">Payment List</p>
        {addPayment ? (
          <CustomButton
            onClick={() => setAddPayment(false)}
            variant="secondary"
          >
            Cancel
          </CustomButton>
        ) : !hasNoData ? (
          <CustomButton onClick={() => setAddPayment(true)} className="text-white">
            Add Payment
          </CustomButton>
        ) : null}
      </div>

      {!addPayment && (
        <>
          {/* Show loading state */}
          {isLoading && (
            <div className="text-center py-8">
              <p>Loading...</p>
            </div>
          )}

          {/* Show error state */}
          {isError && (
            <div className="text-center py-8">
              <p className="text-red-500">Error fetching payment data.</p>
            </div>
          )}

          {/* Show no data state */}
          {hasNoData && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                  <p className="text-gray-500 mb-6">You haven't made any payments yet. Start by adding your first payment.</p>
                  <CustomButton onClick={() => setAddPayment(true)} className="text-white">
                    Add Payment
                  </CustomButton>
                </div>
              </div>
            </div>
          )}

          {/* Show data when available */}
          {!isLoading && !isError && paymentData.length > 0 && (
            <>
              {/* Controls - Only show when there's data */}
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
                  placeholder="Search by Voucher ID..."
                  className="border border-gray-300 rounded px-3 py-2 w-full md:w-64"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <p className="text-gray-600 mb-3 font-medium">
                Total Payments - {totalCount}
              </p>

              {/* Payment Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredpayment.map((payment, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition"
                  >
                    <KeyValueItem label="Order" value={`#${payment.sr_no}`} />
                    <KeyValueItem
                      label="Voucher Date"
                      value={payment.voucher_date?.split(" ")[0]}
                    />
                    <KeyValueItem
                      label="Total Amount"
                      value={formatIndianPrice(payment.amount)}
                    />
                    <KeyValueItem
                      label="Payment Mode"
                      value={getPaymentMode(payment.payment_mode)}
                    />

                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        document.body.style.overflow = "hidden";
                      }}
                      className="text-green-600 font-medium flex items-center mt-3"
                    >
                      View <span className="ml-1">→</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination - Only show when there's data and more than one page */}
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
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Add Payment Form */}
      {addPayment && <AddPayemt setClose={setAddPayment} onSuccess={handlePaymentSuccess} />}

      {/* Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 z-10"
              onClick={() => {
                setSelectedPayment(null);
                document.body.style.overflow = "auto";
              }}
            >
              <X size={24} />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center">
              Payment Detail
            </h2>

            <div className="space-y-2 text-sm">
              <KeyValueItem
                label="Payment No."
                value={selectedPayment.sr_no || "NA"}
              />
              <KeyValueItem
                label="Voucher Date"
                value={selectedPayment.voucher_date?.split(" ")[0] || "NA"}
              />
              <KeyValueItem
                label="TDS"
                value={selectedPayment.tds_type ? "Yes" : "No"}
              />
              <KeyValueItem
                label="Rate of TDS"
                value={
                  selectedPayment.rate_of_tds
                    ? `${selectedPayment.rate_of_tds}%`
                    : "0%"
                }
              />
              <KeyValueItem
                label="TDS Amount"
                value={`₹ ${selectedPayment.tds_amount || 0}`}
              />
              <KeyValueItem
                label="Under Section"
                value={selectedPayment.under_section == 1 ? "us 206 c1 (H1)" : "194Q Section" }
              />
              <KeyValueItem
                label="Payment Mode"
                value={getPaymentMode(selectedPayment.payment_mode)}
              />
              <KeyValueItem
                label="Transaction Number"
                value={selectedPayment.transaction_number || selectedPayment.transaction_id || "NA"}
              />
              <KeyValueItem
                label="Mode of Transaction"
                value={getTransactionMode(selectedPayment.mode_of_transaction)}
              />
              <KeyValueItem
                label="Narration"
                value={selectedPayment.narration || selectedPayment.remark || "NA"}
              />
              <KeyValueItem
                label="Total Cash Received"
                value={`₹ ${selectedPayment.cash_received || selectedPayment.cash_amount || 0}`}
              />
              <KeyValueItem
                label="Total Online Received"
                value={`₹ ${selectedPayment.online_received || selectedPayment.amount || 0}`}
              />
              
              {/* Order Details Section */}
              <div className="border-t pt-3 mt-4">
                <h3 className="font-medium text-gray-800 mb-2">Order Details</h3>
                <KeyValueItem
                  label="Order IDs"
                  value={getOrderIds(selectedPayment.orders)}
                />
                <KeyValueItem
                  label="Cash Received"
                  value={`₹ ${selectedPayment.online_received}`}
                />
                <KeyValueItem
                  label="Online Received"
                  value={`₹ ${selectedPayment.cash_received}`}
                />
                {/* If you want to show individual orders in a more detailed way */}
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;