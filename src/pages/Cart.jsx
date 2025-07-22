import React, { useEffect, useState } from "react";
import { Minus, Plus, Trash } from "lucide-react";
import { formatIndianPrice } from "../utils/utils";
import CustomDropdown from "../components/CustomDropdown";
import {
  useAddOrUpdateCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../store/cartApi";
import { toast } from "react-toastify";
import { ContentLoader } from "../components/PageLoader";
import { Link, useNavigate } from "react-router-dom";
import CustomDatePicker from "../components/CustomDatePicker";
import { format } from "date-fns";
import { useGetAddressListQuery } from "../store/services";

const CartItem = ({ item }) => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("customer"));
  const [inputValue, setInputValue] = useState(String(item.count));
  const [addOrUpdateCart] = useAddOrUpdateCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  useEffect(() => {
    setInputValue(String(item.count));
  }, [item.count]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setInputValue(val);
    }
  };

  const handleInputBlur = async () => {
    const parsed = parseInt(inputValue);
    const count = isNaN(parsed) ? 0 : Math.max(parsed, 0);

    if (count === 0) {
      await handleCartAction(item.productid, "0", 2);
    } else {
      await handleCartAction(item.productid, String(count), 1, 1);
    }
  };

  const handleCartAction = async (productId, count, action, recount = 1) => {
    try {
      if (!userData?.userid) return toast.error("User not logged in");

      if (action === 1) {
        const result = await addOrUpdateCart({
          userId: userData.userid,
          productId,
          count,
          returncount: recount,
        }).unwrap();
        if (result?.success) toast.success(result.message);
        else toast.error(result.message || "Failed to update cart");
      } else if (action === 2) {
        const result = await removeFromCart({
          userId: userData.userid,
          productId,
        }).unwrap();
        if (result?.success) toast.success(result.message);
        else toast.error(result.message || "Failed to remove from cart");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  const updateEmptyCylReturn = (item, value) => {
    handleCartAction(item.productid, item?.count, 1, value);
  };

  const getReturnCylinderOptions = (itemCount) => {
    const count = Number(itemCount) || 0;
    return Array.from({ length: count + 1 }, (_, i) => ({
      value: i,
      label: i.toString(),
    }));
  };

  const calculateSecurityDeposit = () => {
    const securityDeposit = Number(item?.securitydeposit || 0);
    const count = Number(item?.count || 0);
    const returnCylinder = Number(item?.returnclinder || 0);
    return securityDeposit * (count - returnCylinder);
  };

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex flex-col md:flex-row gap-4 relative">
        <button
          onClick={() => handleCartAction(item.productid, "0", 2)}
          className="p-2 bg-red-500 text-white rounded-full absolute top-1 right-2 flex md:hidden"
        >
          <Trash size={15} />
        </button>
        <div
          className="flex-shrink-0 cursor-pointer mx-auto sm:mx-auto"
          onClick={() => navigate(`/products/detail/${item?.productid}`)}
        >
          <img
            src={item.url}
            alt={item.description}
            className="w-20 h-24 object-contain rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {item.type}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-semibold text-gray-900">
                  ₹ {item.price}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₹ {item.actualprice}
                </span>
              </div>
              <p className="text-md font-medium text-[#239e4a] mt-2">
                Estimate Delivery {item.estimatedtime}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-4">
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    const newCount = Math.max(Number(item.count) - 1, 0);
                    handleCartAction(
                      item.productid,
                      String(newCount),
                      newCount === 0 ? 2 : 1
                    );
                  }}
                  className="w-8 h-8 rounded-md bg-[#239e4a] text-white flex items-center justify-center"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="w-12 h-8 border border-gray-300 rounded text-center text-sm font-medium"
                />
                <button
                  onClick={() => {
                    const newCount = Number(item.count) + 1;
                    handleCartAction(item.productid, String(newCount), 1, String(newCount));
                    setInputValue(String(newCount));
                  }}
                  className="w-8 h-8 rounded-md bg-[#239e4a] text-white flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => handleCartAction(item.productid, "0", 2)}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded hidden md:flex"
              >
                Remove
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-700">Empty Cyl. return :</span>
                <CustomDropdown
                  size="small"
                  value={item.returnclinder}
                  onChange={(e) => updateEmptyCylReturn(item, e.value)}
                  options={getReturnCylinderOptions(item?.count)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {item?.returnclinder < item.count && (
        <p className="text-md font-medium text-[#239e4a] mt-2">
          Security Deposit: {formatIndianPrice(calculateSecurityDeposit())}
        </p>
      )}
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [scheduledOrder, setScheduledOrder] = useState(false);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [scheduledData, setScheduledData] = useState({
    date: format(tomorrow, "yyyy-MM-dd"),
    timeSlot: "7:00 AM to 10:00 AM",
  });
// console.log("Scheduled Data:", scheduledData);
  const userData = JSON.parse(localStorage.getItem("customer"));
  const { data: addressList } = useGetAddressListQuery(userData?.userid, {
    skip: !userData?.userid,
    refetchOnMountOrArgChange: true,
  });
 

  const latlong = addressList?.data?.find((v) => v.shipping == 1)?.latlong?.split(",") || [];

  const { data, isLoading } = useGetCartQuery(
    {
      userId: userData?.userid,
      lat: latlong[0] || "",
      long: latlong[1] || "",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
//  console.log("Cart Data:", data);
  useEffect(() => {
    if (data?.data) {
      setCartItems(data.data);
    }
  }, [data]);

  if (isLoading) {
    return <ContentLoader />;
  }

  if (cartItems?.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-l  g font-medium text-black text-center py-6 px-2">
          Cart is empty!{" "}
        </p>
        <button
          onClick={() => navigate(`/products/All`)}
          className="underline text-xl font-semibold text-[#239e4a] cursor-pointer"
        >
          Click Here
        </button>
        <p className="text-lg font-medium text-black text-center py-6 px-2">
          To add Cylinders
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Cart</h1>
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <CartItem key={index} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            {(() => {
              const taxableAmount = cartItems.reduce(
                (sum, item) => sum + Number(item.price) * Number(item.count),
                0
              );

              const gstAmount = cartItems.reduce((sum, item) => {
                const itemTotal = Number(item.price) * Number(item.count);
                const gstRate = Number(item.gst || 0);
                return sum + itemTotal * (gstRate / 100);
              }, 0);

              const totalSecurityDeposit = cartItems.reduce(
                (sum, item) =>
                  sum +
                  Number(item.securitydeposit) *
                    (Number(item.count) - Number(item.returnclinder)),
                0
              );

              const totalPrice =
                taxableAmount + gstAmount + totalSecurityDeposit;

              return (
                <>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of Products</span>
                      <span className="font-medium">{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Count</span>
                      <span className="font-medium">
                        {cartItems.reduce((sum, item) => sum + Number(item.count), 0)}
                      </span>
                    </div>
                    <div className="flex justify-between font-normal">
                      <span className="text-gray-900">Taxable Amount</span>
                      <span className="text-gray-900 font-medium">
                        {formatIndianPrice(taxableAmount.toFixed(2))}
                      </span>
                    </div>
                    <div className="flex justify-between font-normal">
                      <span className="text-gray-900">GST Amount</span>
                      <span className="text-gray-900 font-medium">
                        {formatIndianPrice(gstAmount.toFixed(2))}
                      </span>
                    </div>
                    {totalSecurityDeposit > 0 && (
                      <div className="flex justify-between font-normal">
                        <span className="text-gray-900">Security Deposit</span>
                        <span className="text-gray-900 font-medium">
                          {formatIndianPrice(totalSecurityDeposit.toFixed(2))}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-md font-semibold border-t border-gray-200 pt-4">
                      <span className="text-gray-900">Total Price</span>
                      <span className="text-gray-900">
                        {formatIndianPrice(totalPrice.toFixed(2))}
                      </span>
                    </div>

                    {/* Scheduled Order Checkbox */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="scheduledOrder"
                        checked={scheduledOrder}
                        onChange={(e) => setScheduledOrder(e.target.checked)}
                        className="w-4 h-4 text-[#239e4a] border-gray-300 rounded"
                      />
                      <label htmlFor="scheduledOrder" className="text-sm text-gray-700">
                        Scheduled Order
                      </label>
                    </div>

                    {/* Date + Time Slot Selection */}
                    {scheduledOrder && (
                      <>
                        <CustomDatePicker
                          label="Schedule Date"
                          min={format(tomorrow, "yyyy-MM-dd")}
                          value={scheduledData.date}
                          onChange={(e) =>
                            setScheduledData((pre) => ({
                              ...pre,
                              date: e.target.value,
                            }))
                          }
                        />
                        <CustomDropdown
                          label="Select Slot"
                          value={scheduledData.timeSlot}
                          onChange={(e) =>
                            setScheduledData((pre) => ({
                              ...pre,
                              timeSlot: e.value,
                            }))
                          }
                          options={[
                            { label: "7:00 AM to 10:00 AM", value: "7:00 AM to 10:00 AM" },
                            { label: "10:00 AM to 1:00 PM", value: "10:00 AM to 1:00 PM" },
                            { label: "1:00 PM to 4:00 PM", value: "1:00 PM to 4:00 PM" },
                            { label: "4:00 PM to 7:00 PM", value: "4:00 PM to 7:00 PM" },
                          ]}
                        />
                      </>
                    )}

                    {/* Proceed Button */}
                    <button
                      onClick={() => {
                        if (!scheduledOrder) {
                          toast.error("Please select Scheduled Order before proceeding");
                          return;
                        }
                        navigate("/place-order/address",{
                          state: { scheduledData }
                        });
                      }}
                      disabled={!scheduledOrder}
                      className={`w-full ${
                        scheduledOrder
                          ? "bg-[#239e4a] hover:bg-green-700"
                          : "bg-gray-400 cursor-not-allowed"
                      } text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-4`}
                    >
                      Proceed
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Cart;
