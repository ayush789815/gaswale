import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // For navigation
import { ArrowRight } from "lucide-react";
import CustomButton from "../components/CustomButton";
import Address from "./profile/Address";
import { toast } from "react-toastify";

const AddressSelection = () => {
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
  const scheduledData = state?.scheduledData;
  const handleContinue = () => {
    if (!isAddressSelected) {
      toast.warn("Please select an address before continuing");
      return;
    }
    navigate("/payment-type-selection", { state: { scheduledData } });
  };

  return (
    <div className="container mx-auto p-6">
      <Address onSelectionChange={setIsAddressSelected} />
      <div className="flex justify-end">
        <CustomButton
          className="gap-2 text-white mt-2"
          onClick={handleContinue}
          disabled={!isAddressSelected}
        >
          Continue <ArrowRight size={20} />
        </CustomButton>
      </div>
    </div>
  );
};

export default AddressSelection;
