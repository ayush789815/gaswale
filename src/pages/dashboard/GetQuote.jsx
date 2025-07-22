import React, { useState } from "react";
import { useGetProductListQuery } from "../../store/services";
import CustomDropdown from "../../components/CustomDropdown";
import CustomButton from "../../components/CustomButton";
import { X } from "lucide-react";
import { CustomInput } from "../../components/CustomInput";
import axios from "axios";
import { toast } from "react-toastify";

const GetQuote = ({ setClose }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [singleProduct, setSingleProduct] = useState("");
  const [loadingStage, setLoadingStage] = useState(""); // "submitted", "review", "done"
  const [showLoader, setShowLoader] = useState(false);

  const userData = JSON.parse(localStorage.getItem("customer"));

  const { data } = useGetProductListQuery({
    userid: userData?.userid || "",
    type: "",
  });

  const productData =
    data?.data?.map((item) => ({
      label: `${item?.description} - ${item?.type}`,
      value: item?.uuid,
    })) || [];

  const filteredProduct = productData?.filter(
    (item) => !selectedProducts.find((sp) => sp.product == item.value)
  );

  const handleAddProduct = (productUuid) => {
    if (!productUuid) return;
    setSelectedProducts((prev) => [...prev, { product: productUuid, qty: 1 }]);
    setSingleProduct(""); // Reset dropdown after adding
  };

  const handleProductChange = (index, key, value) => {
    if (key === "qty") {
      if (!/^\d*$/.test(value)) return;
      const numericValue = Number(value);
      if (numericValue < 1 && value !== "") return;
    }
    const updated = [...selectedProducts];
    updated[index][key] = value;
    setSelectedProducts(updated);
  };

  const handleQtyBlur = (index) => {
    const updated = [...selectedProducts];
    const currentQty = updated[index].qty;
    if (!currentQty || isNaN(currentQty) || Number(currentQty) < 1) {
      updated[index].qty = "1";
      setSelectedProducts(updated);
    }
  };

  const handleRemoveProduct = (index) => {
    const updated = [...selectedProducts];
    updated.splice(index, 1);
    setSelectedProducts(updated);
  };

  const handleSubmit = () => {
    if (selectedProducts?.length === 0) return;

    setShowLoader(true);
    setLoadingStage("submitted");

    setTimeout(() => {
      setLoadingStage("review");
    }, 7000); // show "review" after 7 sec

    setTimeout(async () => {
      setLoadingStage("done");

      // Now call actual quotation API
      try {
        const body = new FormData();
        body.append("userid", userData?.userid);
        body.append("ingress", 4);
        selectedProducts?.forEach((v) => body.append("productid[]", v.product));
        selectedProducts?.forEach((v) => body.append("qty[]", v.qty));

        const res = await axios.post(
          "https://gaswale.vensframe.com/api/create-quotation",
          body,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const response = res.data;
        if (response.success) {
          toast.success(response.message);
          setTimeout(() => {
            setShowLoader(false);
            setClose(false);
          }, 2000);
        } else {
          toast.error(response.message);
          setShowLoader(false);
        }
      } catch (error) {
        toast.error("Something went wrong!");
        setShowLoader(false);
      }
    }, 20000); // full process ends in 20 sec
  };
  const renderLoaderUI = () => {
    return (
<div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex justify-center items-center z-50">
<div className="bg-white/90 backdrop-blur-md p-6 rounded-md shadow-lg text-center w-[300px]">
          <h2 className="text-lg font-semibold mb-2">Quotation Request</h2>

          {loadingStage === "submitted" && (
            <>
              <div className="w-full bg-transparent h-2 rounded">
                <div className="bg-green-400 h-2 w-1/4 rounded"></div>
              </div>
              <p className="mt-4">📝 Enquiry Submitted</p>
            </>
          )}
          {loadingStage === "review" && (
            <>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-green-500 h-2 w-3/4 rounded"></div>
              </div>
              <p className="mt-4">🔍 Enquiry Under Review</p>
            </>
          )}
          {loadingStage === "done" && (
            <>
              <div className="text-green-600 text-3xl mb-2">✅</div>
              <p className="font-bold text-green-700">
                Your Quotation Successfully Generated!
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="">
      {showLoader && renderLoaderUI()}

      {selectedProducts.map((item, index) => (
        <div
          key={index}
          className="mb-3 items-center w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <CustomInput
            value={
              productData.find((p) => p.value === item.product)?.label || ""
            }
            readOnly
          />
          <div className="flex items-center gap-2  w-full">
            <CustomInput
              leftIcon={"QTY :"}
              min={1}
              value={item.qty}
              onChange={(e) =>
                handleProductChange(index, "qty", e.target.value)
              }
              onBlur={() => handleQtyBlur(index)}
            />

            <button
              variant="outline"
              onClick={() => handleRemoveProduct(index)}
            >
              <X />
            </button>
          </div>
        </div>
      ))}

      <div className="mt-4 w-full max-w-md">
        <CustomDropdown
          label={"Select Product"}
          options={filteredProduct}
          placeholder="Select Product"
          value={singleProduct}
          onChange={(val) => handleAddProduct(val?.value)}
        />
      </div>
      <div className="flex justify-end mt-2">
        <CustomButton
          disabled={selectedProducts?.length === 0}
          onClick={handleSubmit}
          className="text-white"
        >
          Get a Quote
        </CustomButton>
      </div>
    </div>
  );
};

export default GetQuote;
