import React, {  useState } from "react";
import { Eye, RotateCcw, FileText, Star, Repeat } from "lucide-react";
import {
  useGetPurchaseOrderQuery,
} from "../../store/services";
import { ContentLoader } from "../../components/PageLoader";
import CustomButton from "../../components/CustomButton";
import CustomRadioButton from "../../components/CustomRadioButton";
import CustomModal from "../../components/CustomModal";
import { formatIndianPrice } from "../../utils/utils";
import AddPO from "./AddPO";

const PurchaseOrder = () => {
  const [selected, setSelected] = useState("Active");
  const [addPO, setAddPO] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const userData = JSON.parse(localStorage.getItem("customer"));
  const { data, isLoading, isError   } = useGetPurchaseOrderQuery(
    {
      userid: userData?.userid,
    },
    { refetchOnMountOrArgChange: true }
  );

  const quotData = selected == "Active" ? data?.active : data?.executed || [];
  const calculateTotalPrice = (items) => {
    return items?.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const consumed = Number(item.consumed) || 0;
      const qty = Number(item.qty) || 0;
      return acc + (qty - consumed) * price;
    }, 0);
  };


  return (
    <div className="w-full">
      <div className="flex gap-2 items-center justify-between mb-3">
        <p className="text-gray-600 font-medium text-xl">Purchase Order</p>

        {addPO ? (
          <CustomButton onClick={() => setAddPO(false)} variant="secondary" className="text-white">
            Cancel
          </CustomButton>
        ) : (
          <CustomButton onClick={() => setAddPO(true)} className="text-white">
            Generate PO
          </CustomButton>
        )}
      </div>
      {addPO || (
        <div className="flex gap-4 items-center mb-3">
          <CustomRadioButton
            label="Active"
            name="serviceType"
            value="Active"
            checked={selected == "Active"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <CustomRadioButton
            label="Executed"
            name="serviceType"
            value="executed"
            checked={selected == "executed"}
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
      )}
      {/* Cards */}
      {addPO ||
        (isLoading ? (
          <ContentLoader />
        ) : isError ? (
          <p className="text-red-500">Error fetching orders.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {quotData.map((quote, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-4 gap-2 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-2 items-center justify-between">
                  <p className="font-semibold">#{quote.ponum}</p>
                  <Eye
                    className="text-[#0d6efd] cursor-pointer"
                    onClick={() => {
                      setSelectedData(quote);
                      setIsModalOpen(true);
                    }}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  {/* <p className="text-sm text-gray-500 ">Date: </p> */}
                  <p className="font-medium">{quote.podate}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-gray-500 ">Products: </p>
                  <p className="font-medium text-black ">
                    {quote.products?.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      {addPO && <AddPO setClose={setAddPO} />}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Purchase Details" 
        showHeader={true}
        backdropClose={true}
      >
        <div className="mb-4 flex flex-col">
          <h2 className="text-lg font-medium mb-2">
            PO Number : {selectedData?.ponum}
          </h2>
          <p className="text-sm font-medium">Date: {selectedData?.podate}</p>
         <p className="text-sm font-medium">Quatation Number: {selectedData?.sr_no}</p>
         <p className="text-sm font-medium">Quatation Date: {selectedData?.sr_no}</p>
        </div>

        {/* Table */}
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
                  {item.description}  {item.type}
                </td>
                <td className="py-2 px-1 text-center">{item.qty}</td>
                <td className="py-2 px-1 text-center">{item.qty - item.consumed}</td>
                <td className="py-2 px-1 text-right">
                  {formatIndianPrice(item.price)}
                </td>
                <td className="py-2 px-1 text-right">
                  {item.price}
                </td>
                {/* <td className="py-2 px-1 text-right">
                  {formatIndianPrice(
                    Number(item.price) * Number(item?.consumed)
                  )}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-end mt-4 font-semibold text-lg">
          <span className="mr-4">Total</span>
          <span>
            {formatIndianPrice(calculateTotalPrice(selectedData?.products))}
          </span>
        </div>
      </CustomModal>
    </div>
  );
};

export default PurchaseOrder;
