import React, { useState, useEffect } from "react";
import { ContentLoader } from "../components/PageLoader";
import { ProductCard } from "../components";
import { useParams } from "react-router-dom";
import { Login } from "../components/LoginPopup";
import CustomModal from "../components/CustomModal";
import { useNavigate } from "react-router-dom"; // import this at the top
import {
  useGetProductListQuery,
  useAddOrUpdateCartMutation,
} from "../store/cartApi";
import { toast } from "react-toastify";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // hook to redirect

  const { id } = useParams();
  const userData = JSON.parse(localStorage.getItem("customer"));

  const { data, isLoading } = useGetProductListQuery({
    userId: userData?.userid || "",
    type: id == "All" || id == "PMs" ? "" : id,
  });
  const [addOrUpdateCart] = useAddOrUpdateCartMutation();

  useEffect(() => {
    const addSavedProductsToCart = async () => {
      if (userData?.userid) {
        const savedProducts =
          JSON.parse(localStorage.getItem("cartWithoutLogin")) || [];
        if (savedProducts.length > 0) {
          for (const product of savedProducts) {
            try {
              await addOrUpdateCart({
                userId: userData.userid,
                productId: product.uuid,
                count: product.count,
                returncount: product.count,
              }).unwrap();
            } catch (error) {
              console.error(
                "Failed to add product from localStorage to cart",
                error
              );
            }
          }
          localStorage.removeItem("cartWithoutLogin");
          toast.success("Saved products added to your cart!");
        }
      }
    };

    addSavedProductsToCart();
  }, [userData?.userid, addOrUpdateCart]);

  const filteredData = data?.data || [];

  if (isLoading) {
    return <ContentLoader />;
  }

  return (
    <>
      <div className="flex justify-center py-6 px-2 sm:px-4">
        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-3 
            md:grid-cols-4 
            lg:grid-cols-6 
            gap-3 
            sm:gap-4 
            max-w-7xl 
            w-full
          "
        >
          {filteredData?.map((item, index) => (
            <ProductCard
              key={item.id || index}
              item={item}
              onLoginClick={() => setIsModalOpen(true)}
            />
          ))}
        </div>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showHeader={false}
        backdropClose={false}
      >
        <Login
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false); // close modal
            navigate("/cart"); // redirect to cart
          }}
        />{" "}
      </CustomModal>
    </>
  );
};

export default Products;
