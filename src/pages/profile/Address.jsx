import React, { useEffect, useState } from "react";
import {
  useGetAddressListQuery,
  useDeleteAddressMutation,
  useUpdateShippingStatusMutation,
} from "../../store/services";
import { ContentLoader } from "../../components/PageLoader";
import { Edit, Trash } from "lucide-react";
import CustomButton from "../../components/CustomButton";
import AddAddress from "./AddAddress";
import CustomModal from "../../components/CustomModal";
import CustomSwitch from "../../components/CustomSwitch";
import { toast } from "react-toastify";

const Address = ({onSelectionChange}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [addressIdToDelete, setAddressIdToDelete] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [updateShippingStatus] = useUpdateShippingStatusMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const userData = JSON.parse(localStorage.getItem("customer"));
  const { data, refetch, isLoading } = useGetAddressListQuery(
    userData?.userid,
    {
      skip: !userData?.userid,
    }
  );

  const address_list = data?.data || [];
  useEffect(() => {
    const activeAddress = address_list.find((item) => item.shipping === "1");
    if (typeof onSelectionChange === "function") {
      onSelectionChange(!!activeAddress); // true if any address is active
    }
  }, [address_list]);

  useEffect(() => {
    if (!showAdd && !isDelete) {
      refetch();
    }
  }, [showAdd, isDelete]);

  const handleSetActive = async (addressId, currentValue) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const newValue = currentValue === "1" ? "0" : "1";

    try {
      const res = await updateShippingStatus({
        userid: userData.userid,
        id: addressId,
        value: newValue,
      }).unwrap();

      if (res.success) {
        toast.success(
          `Address ${
            newValue === "1" ? "activated" : "deactivated"
          } successfully`
        );
        refetch();
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteAddress({
        userid: userData.userid,
        addressid: addressIdToDelete,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Address deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Failed to delete address");
      }
    } catch (err) {
      toast.error("Error deleting address");
      console.error(err);
    } finally {
      setIsDelete(false);
    }
  };

  if (isLoading) return <ContentLoader />;

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between gap-5 items-center mb-5">
        <p className="font-sans font-medium text-xl">Shipping Address</p>
        {!showAdd ? (
          <CustomButton
            onClick={() => {
              setSelectedData({});
              setIsEdit(false);
              setShowAdd(true);
            }}
            className="text-white"
          >
            Add Address
          </CustomButton>
        ) : (
          <CustomButton onClick={() => setShowAdd(false)} variant="secondary">
            Cancel
          </CustomButton>
        )}
      </div>

      {!showAdd && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {address_list.map((item) => (
            <div
              key={item.id}
              className={`border border-gray-300 rounded-md p-4 shadow-sm bg-white ${
                item.shipping === "1" ? "border-green-500" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-sans font-medium text-lg">Address</h4>
                <div className="flex gap-2">
                  <Edit
                    size={20}
                    color="blue"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedData(item);
                      setIsEdit(true);
                      setShowAdd(true);
                    }}
                  />
                  <Trash
                    size={20}
                    color="red"
                    className="cursor-pointer"
                    onClick={() => {
                      setIsDelete(true);
                      setAddressIdToDelete(item.id);
                    }}
                  />
                </div>
              </div>
              <p className="text-sm">{item?.shipping_address}</p>

              <div className="mt-3 flex justify-between items-center">
                <CustomButton>
                  <a
                    href={item.shipping_address_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="  text-white text-sm  "
                  >
                   Address Link{" "}
                  </a>
                </CustomButton>
                <CustomSwitch
                  checked={item?.shipping === "1"}
                  onChange={() =>
                    handleSetActive(parseInt(item.id), item.shipping)
                  }
                  id={`active-${item.id}`}
                  fullWidth
                  disabled={isUpdating || item.shipping === "1"}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="flex w-full">
          <AddAddress
            setClose={setShowAdd}
            isEdit={isEdit}
            selectedData={selectedData}
          />
        </div>
      )}

      <CustomModal isOpen={isDelete} onClose={() => setIsDelete(false)}>
        <p>Are you sure you want to delete this address?</p>
        <div className="flex gap-2 justify-end mt-2">
          <CustomButton onClick={() => setIsDelete(false)} variant="secondary">
            Cancel
          </CustomButton>
          <CustomButton onClick={handleDelete}>Delete</CustomButton>
        </div>
      </CustomModal>
    </div>
  );
};

export default Address;
