import React, { useState } from "react";
import { useLocation, useNavigate  } from "react-router-dom";

import {
  useGetPurchaseOrderQuery,
  useFetchPaymentListQuery,
  useGetAddressListQuery,
} from "../store/services";
import CustomButton from "../components/CustomButton";
import CustomSwitch from "../components/CustomSwitch";
import CustomModal from "../components/CustomModal";
import { Eye } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { formatIndianPrice } from "../utils/utils";

const PaymentTypeSelection = () => {
  const userData = JSON.parse(localStorage.getItem("customer"));
  const Navigate = useNavigate();

  const [paymentType, setPaymentType] = useState("COD");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const { state } = useLocation();
  const scheduledData = state?.scheduledData;
  // console.log(scheduledData, "scheduledData");
  const { data: purchaseOrdersData, isLoading: purchaseOrderLoading } =
    useGetPurchaseOrderQuery({ userid: userData?.userid });

    console.log(purchaseOrdersData, "purchaseOrdersData");
  const {
    data: paymentListData,
    isLoading: paymentListLoading,
    refetch,
  } = useFetchPaymentListQuery({ userid: userData?.userid });
  // console.log(paymentListData);
  const { data: addressListData, isLoading: addressLoading } =
    useGetAddressListQuery(userData?.userid);

  const handlePlaceOrder = async () => {
    if (!termsAccepted) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }

    const orderData = paymentListData?.paylist;
    if (!orderData) {
      toast.error("Failed to fetch payment data.");
      return;
    }

    if (paymentType === "PO" && !selectedPurchaseOrder?.id) {
      toast.error("Please select a Purchase Order");
      return;
    }

    if (addressLoading || !addressListData) {
      toast.error("Address list is still loading, please try again.");
      return;
    }
    console.log(orderData, "orderData");

    const activeAddress = addressListData?.data?.find(
      (addr) => `${addr.id}` === `${orderData?.address}`
    );

    if (!activeAddress?.shipping_address) {
      toast.error("Shipping address is required. Please select one.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("userid", userData?.userid || "");
      formData.append("email", orderData?.email || "");
      formData.append("mobile", orderData?.mobile || "");
      formData.append("orderid", orderData?.orderid || "");
      formData.append("address", orderData?.address || "");
      formData.append("totalamount", orderData?.totalamount || 0);
      formData.append("taxable_amount", orderData?.taxable_amount || 0);
      formData.append("gst_amount", orderData?.gst_amount || 0);
      formData.append("paymentmode", paymentType);
      formData.append("paymentstatus", paymentType === "PO" ? "1" : "2");
      formData.append("schedule", scheduledData?.date || "");
      formData.append("scheduletime", scheduledData?.timeSlot || "");

      formData.append(
        "paymentid",
        paymentType === "PO" ? selectedPurchaseOrder?.id : "1"
      );

      (orderData?.itemcodes || []).forEach((item) =>
        formData.append("itemcodes[]", item)
      );
      (orderData?.count || []).forEach((val) =>
        formData.append("count[]", val)
      );
      (orderData?.gst || []).forEach((val) => formData.append("gst[]", val));
      (orderData?.price || []).forEach((val) =>
        formData.append("price[]", val)
      );
      (orderData?.returncylinder || []).forEach((val) =>
        formData.append("returncylinder[]", val)
      );
      (orderData?.securitydeposit || []).forEach((val) =>
        formData.append("securitydeposit[]", val)
      );

      const response = await axios.post(
        "https://gaswale.vensframe.com/api/customer/createorder",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Order API Response:", response?.data);

      if (response?.status === 200 && response?.data?.success === true) {
        toast.success("Order placed successfully!");
        refetch();
        Navigate("/dashboard")
        return; 
      }

      const msg = Array.isArray(response.data.message)
        ? response.data.message[0]
        : response.data.message;

      if (typeof msg === "object" && msg !== null) {
        const errorList = Object.values(msg);
        toast.error(errorList.join("\n"));
      } else {
        toast.error(msg || "Something went wrong");
      }
    } catch (err) {
      console.error("Order Error:", err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalPrice = (items) =>
    items?.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return acc + price * qty;
    }, 0);

  const activeAddress = addressListData?.data?.find(
    (addr) => `${addr.id}` === `${paymentListData?.paylist?.address}`
  );

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Select Payment Type</h2>

      {activeAddress && (
        <p className="text-sm text-gray-600 mb-4">
          Delivering to:{" "}
          <span className="font-semibold">
            {activeAddress.shipping_address}
          </span>
        </p>
      )}

      <div className="flex gap-4 mb-6">
        <CustomButton
          className={`py-2 px-4 rounded-lg ${
            paymentType === "COD"
              ? "bg-green-500 text-white"
              : "bg-white text-green-500 border border-green-500"
          }`}
          onClick={() => setPaymentType("COD")}
        >
          Cash on Delivery
        </CustomButton>
        <CustomButton
          className={`py-2 px-4 rounded-lg ${
            paymentType === "PO"
              ? "bg-green-500 text-white"
              : "bg-white text-green-500 border border-green-500"
          }`}
          onClick={() => setPaymentType("PO")}
        >
          Purchase Order
        </CustomButton>
      </div>

      {paymentType === "PO" && (
        <div className="w-full mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Purchase Order</h3>

          {purchaseOrderLoading ? (
            <p>Loading purchase orders...</p>
          ) : Array.isArray(purchaseOrdersData?.active) &&
            purchaseOrdersData.active.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {purchaseOrdersData.active.map((order, idx) => (
                <div
                  key={idx}
                  className={`border border-gray-200 rounded-md p-4 gap-2 shadow-sm hover:shadow-md transition cursor-pointer ${
                    selectedPurchaseOrder?.id === order.id
                      ? "border-green-500 bg-green-100"
                      : ""
                  }`}
                  onClick={() => setSelectedPurchaseOrder(order)}
                >
                  <div className="flex gap-2 items-center justify-between">
                    <p className="font-semibold">#{order.ponum}</p>
                    <Eye
                      className="text-[#0d6efd] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedData(order);
                        setIsModalOpen(true);
                      }}
                    />
                  </div>
                  <p className="font-medium">{order.podate}</p>
                  <div className="flex gap-1 items-center">
                    <p className="text-sm text-gray-500 ">Products:</p>
                    <p className="font-medium">{order.products?.length}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No purchase orders available.</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <CustomSwitch
          label="I agree to the Terms & Conditions"
          checked={termsAccepted}
          onChange={setTermsAccepted}
        />
        <button
          className="text-blue-500 underline"
          onClick={() => {
            setSelectedData(null); 
            setIsModalOpen(true); 
          }}
        >
          View Terms
        </button>
      </div>

      <div className="flex justify-end">
        <CustomButton
          onClick={handlePlaceOrder}
          disabled={isLoading || paymentListLoading}
          className="text-white"
        >
          {isLoading ? "Placing Order..." : "Place Order"}
        </CustomButton>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedData ? "Purchase Order" : "Terms and Conditions"}
        showHeader={true}
        backdropClose={true}
      >
        {selectedData ? (
          <>
            <div className="mb-4 flex flex-col">
              <h2 className="text-lg font-medium mb-2">
                PO Number : {selectedData?.ponum}
              </h2>
              <p className="text-sm font-medium">
                Date: {selectedData?.podate}
              </p>
               <p className="text-sm font-medium">
                Quaotation Number: {selectedData?.sr_no}
              </p>
               <p className="text-sm font-medium">
               Quaotation Date: {selectedData?.quotation_date}
              </p>
            </div>

            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="py-2 px-1">Name</th>
                  <th className="py-2 px-1 text-center">Total Qty</th>
                  <th className="py-2 px-1 text-center">Available Qty</th>
                  <th className="py-2 px-1 text-right">Price/Qty</th>
                  <th className="py-2 px-1 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedData?.products?.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-1 whitespace-pre-wrap">
                      {item.description} - {item.type}
                    </td>
                    <td className="py-2 px-1 text-center">{item.qty}</td>
                    <td className="py-2 px-1 text-center">{item.qty - item.consumed}</td>
                    <td className="py-2 px-1 text-right">
                      {formatIndianPrice(item.price)}
                    </td>
                    <td className="py-2 px-1 text-right">
                      {formatIndianPrice(
                        Number(item.price) * Number(item?.qty)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4 font-semibold text-lg">
              <span className="mr-4">Total</span>
              <span>
                {formatIndianPrice(calculateTotalPrice(selectedData?.products))}
              </span>
            </div>
          </>
        ) : (
          <div className="max-h-[400px] overflow-y-auto text-sm space-y-4 px-1">
            <h3 className="font-semibold text-base">
              # Terms and Conditions for Gas Refill Orders
            </h3>

            <div>
              <h4 className="font-medium">
                1. Order Requirements and Confirmation
              </h4>
              <p>
                By placing an order, you confirm you are 18+ years old with
                valid ID. Orders require an empty/near-empty cylinder for
                exchange and are subject to availability in your area. Order
                confirmation will be sent via SMS/email after successful
                payment.
              </p>
            </div>

            <div>
              <h4 className="font-medium">2. Delivery Terms</h4>
              <p>
                Standard delivery time is 24-48 hours from order confirmation.
                An adult must be present during delivery with valid ID
                verification. Safe and accessible delivery location must be
                provided, and empty cylinder must be available for exchange at
                time of delivery.
              </p>
            </div>

            <div>
              <h4 className="font-medium">3. Payment and Pricing</h4>
              <p>
                All prices include applicable taxes and must be paid at order
                placement. Accepted methods include credit/debit cards, digital
                wallets, and cash on delivery (where available). Prices and
                delivery charges are subject to change without notice.
              </p>
            </div>

            <div>
              <h4 className="font-medium">4. Safety and Compliance</h4>
              <p>
                All gas cylinders meet national safety standards and are
                inspected before delivery. Customers must handle and store
                cylinders safely, follow provided safety guidelines, and report
                any leaks or defects immediately to our emergency helpline.
              </p>
            </div>

            <div>
              <h4 className="font-medium">5. Cancellation and Refunds</h4>
              <p>
                Orders can be cancelled free of charge within 30 minutes of
                placement. Cancellations after dispatch may incur charges. Full
                refunds available for undelivered orders, partial refunds for
                delays exceeding 48 hours. No refunds for delivered products
                unless safety defects are reported within 24 hours.
              </p>
            </div>

            <div>
              <h4 className="font-medium">6. Customer Responsibilities</h4>
              <p>
                Provide accurate delivery information and ensure availability
                during delivery window. Inspect cylinder upon delivery and
                report visible defects immediately. Follow all safety protocols
                including proper ventilation, storage, and immediate reporting
                of gas leaks.
              </p>
            </div>

            <div>
              <h4 className="font-medium">7. Emergency Protocol</h4>
              <p>
                In case of gas leak: turn off cylinder valve, evacuate area,
                contact emergency services, and call our 24/7 emergency
                helpline. Do not use electrical appliances or create sparks near
                suspected leak areas.
              </p>
            </div>

            <div>
              <h4 className="font-medium">8. Service Terms</h4>
              <p>
                We reserve the right to refuse orders for safety reasons or
                regulatory restrictions. These terms are governed by local laws
                and may be updated with advance notice. Customer service
                available for queries and complaints with 24-48 hour resolution
                target.
              </p>
            </div>

            <p>
              <strong>
                By proceeding with your order, you accept these terms and
                conditions.
              </strong>
            </p>
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default PaymentTypeSelection;
