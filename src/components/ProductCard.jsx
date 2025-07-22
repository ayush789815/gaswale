import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import {
  useAddOrUpdateCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../store/cartApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatIndianPrice, getImageUrl } from "../utils/utils";

const ProductCard = ({ item, onLoginClick }) => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("customer"));
  const [inputValue, setInputValue] = useState(item?.count || "0");

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
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleInputBlur = () => {
    const newCount = parseInt(inputValue);
    const count = isNaN(newCount) ? 0 : Math.max(newCount, 0);

    if (count === 0) {
      handleCartAction(item.uuid, "0", 2);
    } else {
      handleCartAction(item.uuid, String(count), 1);
    }
  };
  const saveProductToLocalStorage = (product) => {
    const savedProducts = JSON.parse(localStorage.getItem("cartWithoutLogin")) || [];
    // Check if product already exists, update count if needed
    const existingIndex = savedProducts.findIndex(p => p.uuid === product.uuid);
    if (existingIndex > -1) {
      savedProducts[existingIndex].count = (parseInt(savedProducts[existingIndex].count) + 1).toString();
    } else {
      savedProducts.push({ ...product, count: "1" });
    }
    localStorage.setItem("cartWithoutLogin", JSON.stringify(savedProducts));
  };

  return (
    <div className="w-full  border border-gray-200 shadow-md rounded-md p-4 flex flex-col justify-between">
      {/* sm:w-[48%] md:w-[30%] lg:w-[22%] max-w-[180px] */}
      <div className="flex flex-col flex-1">
        <div
          className="h-60 w-full cursor-pointer transform transition duration-300 hover:scale-105 justify-center items-center flex relative"
          onClick={() => navigate(`/products/detail/${item?.uuid}`)}
        >
          <img
            src={getImageUrl(item?.url)}
            alt={item?.description}
            className="h-full w-[70%] object-contain"
          />
          {item?.url.startsWith("https://") && (
            <p className="absolute text-white font-semibold text-md mt-6">
              {item?.capacity} kg
            </p>
          )}
        </div>
        {userData?.userid && (
          <div className="flex w-full bg-[#239e4a] justify-center py-1 text-white mt-4">
            <p className="text-sm">
              {formatIndianPrice(Number(item?.discountprice), "always")} OFF
            </p>
          </div>
        )}
        <p className="mt-2 text-sm font-medium">{item?.description}</p>
      </div>
      <div className="flex gap-1 mt-2">
        <p className="text-sm font-medium">
          {formatIndianPrice(item?.price, "always")}
        </p>
        <p className="text-sm font-normal line-through">
          {formatIndianPrice(item?.actualprice, "always")}
        </p>
      </div>

      {Number(item?.count) > 0 ? (
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const current = Number(item.count || "0");
              const newCount = current <= 1 ? 0 : current - 1;
              handleCartAction(
                item.uuid,
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
              const newCount = String(Number(item.count || "0") + 1);
              handleCartAction(item.uuid, newCount, 1);
              setInputValue(newCount);
            }}
            className="w-8 h-8 rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      ) : (
        <button
          className="font-normal text-sm px-3 py-2 rounded-md bg-[#239e4a] text-white mt-4 cursor-pointer mx-auto"
          onClick={(e) => {
            e.stopPropagation();
            if (userData?.userid) {
              const newCount = "1";
              handleCartAction(item.uuid, newCount, 1);
              setInputValue(newCount);
            } else {
              saveProductToLocalStorage(item);
              onLoginClick();
              toast.info("Product saved. Please login to add to cart.");
            }
          }}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
