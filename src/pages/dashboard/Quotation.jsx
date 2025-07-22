import React, { useEffect, useState } from "react";
import { Eye, RotateCcw, FileText, Star, Repeat } from "lucide-react";
import {
  useGetOrdersListQuery,
  useGetQutationQuery,
} from "../../store/services";
import { ContentLoader } from "../../components/PageLoader";
import CustomButton from "../../components/CustomButton";
import CustomRadioButton from "../../components/CustomRadioButton";
import CustomModal from "../../components/CustomModal";
import { formatIndianPrice } from "../../utils/utils";
import GetQuote from "./GetQuote";

const Quotation = () => {
  const [selected, setSelected] = useState("Active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addQuote, setAddQuote] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const userData = JSON.parse(localStorage.getItem("customer"));
  const { data, isLoading, isError, refetch } = useGetQutationQuery(
    {
      userid: userData?.userid,
      type: selected,
    },
    { refetchOnMountOrArgChange: true }
  );

  const quotData = data?.data || [];

  const calculateTotalPrice = (items) => {
    return items?.reduce((acc, item) => {
      const price = Number(item?.price) || 0;
      const qty = Number(item.qty) || 0;
      return acc + price * qty;
    }, 0);
  };
  useEffect(() => {
    if (!addQuote) {
      refetch();
    }
  }, [addQuote]);

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center justify-between mb-3">
        <p className="text-gray-600 font-medium text-xl">Qutations </p>
        {addQuote ? (
          <CustomButton onClick={() => setAddQuote(false)} variant="secondary">
            Cancel
          </CustomButton>
        ) : (
          <CustomButton onClick={() => setAddQuote(true)} className='text-white'>
            Get a Quote
          </CustomButton>
        )}
      </div>
      {addQuote || (
        <div className="flex gap-4 items-center mb-3">
          <CustomRadioButton
            label="Active"
            name="serviceType"
            value="Active"
            checked={selected == "Active"}
            onChange={(e) => setSelected(e.target.value)}
          />
          <CustomRadioButton
            label="Archived"
            name="serviceType"
            value="archive"
            checked={selected == "archive"}
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
      )}
      {/* Cards */}
      {addQuote ||
        (isLoading ? (
          <ContentLoader />
        ) : isError ? (
          <p className="text-red-500">Error fetching orders.</p>
        ) : (
          //lg:grid-cols-4
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotData.map((quote, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Quotation No :</p>
                  <p className="font-semibold text-base text-black">{quote.sr_no}</p>
                </div>
                <Eye
                  className="text-[#0d6efd] cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => {
                    setSelectedData(quote);
                    setIsModalOpen(true);
                  }}
                />
              </div>
        
              <div className="mb-1">
                <p className="text-sm text-gray-500">Date:</p>
                <p className="text-sm font-medium text-black">{quote.datetime}</p>
              </div>
        
              <div>
                <p className="text-sm text-gray-500">Products:</p>
                <p className="text-sm font-medium text-black">{quote.products?.length}</p>
              </div>
            </div>
          ))}
        </div>
        
        ))}

      {addQuote && <GetQuote setClose={setAddQuote} />}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Quotation"
        showHeader={true}
        backdropClose={true}
      >
        <div className="mb-4 flex flex-col">
          <h2 className="text-lg font-medium mb-2">
            Quotation : {selectedData?.sr_no}
          </h2>
          <p className="text-sm font-medium">Date: {selectedData?.datetime}</p>
        </div>

        {/* Table */}
        <table className="w-full border-collapse">
          <thead className="border-b">
            <tr className="text-left">
              <th className="py-2 px-1">Name</th>
              <th className="py-2 px-1 text-center">Quantity</th>
              <th className="py-2 px-1 text-center">
                Unit Price (inc. GST @ 18%)
              </th>
              <th className="py-2 px-1 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {selectedData?.products?.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2 px-1 whitespace-pre-wrap">
                  {item.description}
                </td>

                <td className="py-2 px-1 text-center">{item.qty}</td>
                <td className="py-2 px-1 text-center">
                  {formatIndianPrice(item.price)}
                </td>
                <td className="py-2 px-1 text-right">
                  {formatIndianPrice(Number(item.price) * Number(item?.qty))}
                </td>
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

export default Quotation;
