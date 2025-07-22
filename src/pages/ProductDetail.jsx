import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ContentLoader } from "../components/PageLoader";
import axios from "axios";
import { formatIndianPrice } from "../utils/utils";
import CustomModal from "../components/CustomModal";
import CustomButton from "../components/CustomButton";
import { Login } from "../components/LoginPopup";
import {
  useAddOrUpdateCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../store/cartApi";
import { Minus, Plus } from "lucide-react";

const baseurl = import.meta.env.VITE_API_BASE_URL;
const ProductDetail = () => {
  const { id } = useParams();
  const userData = JSON.parse(localStorage.getItem("customer"));
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState({});
  console.log(details?.count);

  const [inputValue, setInputValue] = useState(0);

  const [addOrUpdateCart] = useAddOrUpdateCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  useGetCartQuery({ userId: userData?.userid }, { skip: !userData?.userid });

  const handleCartAction = async (productId, count, action) => {
    try {
      if (!userData?.userid) return toast.error("User not logged in");

      if (action === 1) {
        const result = await addOrUpdateCart({
          userId: userData.userid,
          productId,
          count,
          returncount: count,
        }).unwrap();
        if (result?.success) {
          toast.success(result.message, { toastId: "cart-add" });
        } else {
          toast.error(result?.message || "Failed to update cart");
        }
      } else if (action === 2) {
        const result = await removeFromCart({
          userId: userData.userid,
          productId,
        }).unwrap();
        if (result?.success) {
          toast.success(result.message, { toastId: "cart-remove" });
        } else {
          toast.error(result?.message || "Failed to remove from cart");
        }
      }
      fetchDetail();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleInputBlur = () => {
    const newCount = parseInt(inputValue);
    const count = isNaN(newCount) ? 0 : Math.max(newCount, 0);

    if (count === 0) {
      handleCartAction(details?.uuid, "0", 2);
    } else {
      handleCartAction(details?.uuid, String(count), 1);
    }
  };

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const body = new FormData();
      body.append("userid", userData?.userid);
      body.append("id", id);

      const res = await axios.post(
        "https://gaswale.vensframe.com/api/customer/listbyid",
        body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const response = await res.data;
      if (response.success) {
        setInputValue(response?.data[0]?.count);
        setDetails(response?.data[0]);
      } else {
        setDetails({});
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const description = [
    `Category - ${details?.category || ""}`,
    `Unit of measurement - ${details?.uom || ""}`,
    `Material - ${details?.mat}`,
    `Weight - ${details?.wt}`,
    `Height - ${details?.ht} mm`,
    `Diameter - ${details?.dia} mm`,
    `Thickness - ${details?.thick} mm`,
    `Water Capacity - ${details?.wc}`,
    `Working Pressure - ${details?.wp}`,
    `Test Pressure - ${details?.tp}`,
    `Valve Type - ${details?.valvetype}`,
  ];

  if (loading && !details) {
    return <ContentLoader />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image Section */}
      <div className="flex flex-col items-center md:p-8">
        <img
          src={"https://gaswale.vensframe.com/api/" + details?.url}
          alt={details?.name}
          className="w-auto h-[60%] max-w-sm object-contain"
        />
        {/* Thumbnail */}
        <div className="mt-4 border-2 border-blue-500 p-1 rounded">
          <img
            src={"https://gaswale.vensframe.com/api/" + details?.url}
            alt={details?.name}
            className="w-14 h-14 object-contain"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{details?.type}</h1>
        <h2 className="text-lg">{details?.name}</h2>

        <div className="flex items-center gap-3">
          <span className="text-red-600 text-2xl font-bold">
            {formatIndianPrice(details?.discountprice)}
          </span>
          <span className="line-through text-gray-500 text-lg">
            {formatIndianPrice(details?.actualprice)}
          </span>
        </div>

        {Number(details?.count) > 0 ? (
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const current = Number(details?.count || "0");
                const newCount = current <= 1 ? 0 : current - 1;
                handleCartAction(
                  details?.uuid,
                  String(newCount),
                  newCount === 0 ? 2 : 1
                );
                setInputValue(String(newCount));
              }}
              className="w-8 h-8 rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
            >
              <Minus size={16} />
            </button>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setInputValue(val); // Only set if input is digits
                }
              }}
              onBlur={handleInputBlur}
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-8 border border-gray-300 rounded text-center text-sm font-medium"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newCount = String(Number(details?.count || "0") + 1);
                handleCartAction(details?.uuid, newCount, 1);
                setInputValue(newCount);
              }}
              className="w-8 h-8 rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <CustomButton
            onClick={(e) => {
              e.stopPropagation();
              const newCount = "1";
              handleCartAction(details?.uuid, newCount, 1);
              setInputValue(newCount);
            }}
          >
            Add to Cart
          </CustomButton>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <ul className="list-disc pl-6 space-y-1 text-gray-700">
            {description.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showHeader={false}
        backdropClose={false}
      >
        <Login isOpen={isModalOpen} />
      </CustomModal>
    </div>
  );
};

export default ProductDetail;
