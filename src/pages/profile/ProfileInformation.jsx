import React, { useRef, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { CustomInput } from "../../components/CustomInput";
import CustomRadioButton from "../../components/CustomRadioButton";
import { ContentLoader } from "../../components/PageLoader";
import CustomButton from "../../components/CustomButton";
import CustomDropdown from "../../components/CustomDropdown";
import { toast } from "react-toastify";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetCompletelistQuery,
} from "../../store/services";
import { verifyPincode } from "../../utils/utils";
  
const fetchGSTDetails = async (gstin, setLoading) => {
  try {
    setLoading(true);
    const body = new FormData();
    body.append("gstin", gstin);
    const response = await fetch(
      "https://gaswale.vensframe.com/api/customer/gstfetch",
      {
        method: "POST",
        body: body,
      }
    );
    const res = await response.json();
    setLoading(false);
    return res;
  } catch (error) {
    console.error("Error fetching GST details:", error);
    setLoading(false);
    return null;
  }
};

const ProfileInformation = () => {
  const [editable, setEditable] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isShippingSameAsBilling, setIsShippingSameAsBilling] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [gstLoading, setGstLoading] = useState(false);
  const [hideGSTSection, setHideGSTSection] = useState(false);

  const userData = JSON.parse(localStorage.getItem("customer"));
  const { data, isLoading, refetch } = useGetProfileQuery(userData?.userid, {
    skip: !userData?.userid,
  });
  const { data: dropdownData } = useGetCompletelistQuery(selectedState, {
    refetchOnMountOrArgChange: true,
  });

  const stateList = dropdownData?.data?.reponselist?.states?.map((v) => ({
    label: v.name,
    value: v.code,
  }));
  const districtList = dropdownData?.data?.reponselist?.districts?.map((v) => ({
    label: v.name,
    value: v.id,
  }));
  const [updateProfile, { isLoading: isUpdating,isSuccess,isError, error }] = useUpdateProfileMutation();

  useEffect(() => {
    if (data?.data?.[0]) {
      const rec = data.data[0];
      setProfileData({
        ...rec,
        have_gst: rec.is_gst_reg === "1" ? "Yes" : "No",
        have_pan: rec.pan ? "Yes" : "No",
      });

      if (rec.is_gst_reg === "0") {
        localStorage.setItem("hasChosenNoGST", "true");
      }

      localStorage.setItem("profileData", JSON.stringify(rec));
    }
  }, [data]);

  useEffect(() => {
    const hasNoGST = localStorage.getItem("hasChosenNoGST");
    if (hasNoGST === "true") {
      setHideGSTSection(true);
    }
  }, []);

  const lastFetchedGst = useRef(null);

  useEffect(() => {
    const gst = profileData?.gst?.trim();
    if (
      gst &&
      gst.length === 15 &&
      profileData?.have_gst === "Yes" &&
      gst !== lastFetchedGst.current
    ) {
      lastFetchedGst.current = gst;
      fetchGSTDetails(gst, setGstLoading).then((res) => {
        if (res?.error === false) {
          const matchedState = stateList?.find(
            (s) => s.label.toLowerCase() === res.state?.toLowerCase()
          );
          if (matchedState) {
            setSelectedState(matchedState.value);
            setTimeout(() => {
              const updatedDistrictList =
                dropdownData?.data?.reponselist?.districts || [];
              const newDistrict = updatedDistrictList.find(
                (d) => d.name?.toLowerCase() === res.district?.toLowerCase()
              );
              setProfileData((prev) => ({
                ...prev,
                legalname: res.legalname || "",
                tradename: res.tradename || "",
                pan: res.pan || prev.pan,
                address: res.address || prev.address,
                state: matchedState.value,
                district: newDistrict?.id || prev.district,
                pincode: res.pincode || prev.pincode,
              }));
            }, 500);
          } else {
            setProfileData((prev) => ({
              ...prev,
              legalname: res.legalname || "",
              tradename: res.tradename || "",
              pan: res.pan || prev.pan,
              address: res.address || prev.address,
              pincode: res.pincode || prev.pincode,
            }));
          }
          toast.success("GST details fetched and autofilled!");
        } else {
          toast.error("Failed to fetch GST details.");
        }
      });
    }
  }, [
    profileData?.gst,
    profileData?.have_gst,
    stateList,
    districtList,
    dropdownData,
  ]);

  const handlePinVerify = async (pin, isShipping = false) => {
    const response = await verifyPincode({
      data: {
        pincode: pin,
        state: isShipping
          ? profileData?.shipping_state
          : selectedState || profileData?.state,
      },
      setLoading: setPinLoading,
    });
    if (!response) toast.error("Invalid Pin Code");
  };

  const handleShippingSameAsBilling = (checked) => {
    setIsShippingSameAsBilling(checked);
    if (checked) {
      setProfileData((prev) => ({
        ...prev,
        shipping_address: prev.address,
        shipping_landmark: prev.landmark,
        shipping_state: prev.state,
        shipping_district: prev.district,
        shipping_pincode: prev.pincode,
      }));
    }
  };

  const handleUpdate = async () => {
    try {
      if (profileData.have_gst === "Yes" && profileData.gst?.length !== 15) {
        return toast.error("Please enter a valid 15-digit GST number.");
      }
      if (!profileData.email) {
        return toast.error("Email is required");
      }

      if (profileData.have_gst === "No") {
        localStorage.setItem("hasChosenNoGST", "true");
        setHideGSTSection(true);
      }

      const finalShippingData = isShippingSameAsBilling
        ? {
            shipping_address: profileData.address,
            shipping_landmark: profileData.landmark,
            shipping_state: profileData.state,
            shipping_district: profileData.district,
            shipping_pincode: profileData.pincode,
          }
        : {
            shipping_address: profileData.shipping_address || "",
            shipping_landmark: profileData.shipping_landmark || "",
            shipping_state: profileData.shipping_state || "",
            shipping_district: profileData.shipping_district || "",
            shipping_pincode: profileData.shipping_pincode || "",
          };

      const formData = new FormData();
      formData.append("userid", userData.userid);
      formData.append("have_gst", profileData.have_gst || "No");
      formData.append("have_pan", profileData.have_pan || "No");

      if (profileData.have_gst === "Yes") {
        formData.append("gst", profileData.gst || "");
        formData.append("pan", profileData.pan || "");
        formData.append("tradename", profileData.tradename || "");
        formData.append("legalname", profileData.legalname || "");
      } else if (profileData.have_pan === "Yes") {
        formData.append("pan", profileData.pan || "");
        formData.append("name", profileData.name || "");
      } else {
        formData.append("name", profileData.name || "");
      }

      formData.append("email", profileData.email || "");
      formData.append("email1", profileData.email1 || "");
      formData.append("address", profileData.address || "");
      formData.append("landmark", profileData.landmark || "");
      formData.append("state", profileData.state || "");
      formData.append("district", profileData.district || "");
      formData.append("pincode", profileData.pincode || "");
      formData.append("credit_required", profileData.credit_required || "No");
      formData.append("billSameShip", isShippingSameAsBilling ? 1 : 0);
      formData.append("address1", finalShippingData.shipping_address);
      formData.append("state1", finalShippingData.shipping_state);
      formData.append("district1", finalShippingData.shipping_district);
      formData.append("pincode1", finalShippingData.shipping_pincode);
      formData.append(
        "latlong",
        `${profileData?.latitude || ""},${profileData?.longitude || ""}`
      );

      const response = await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      refetch();
      setEditable(false);
    } catch (err) {
      console.error("Error updating profile:", err?.data || err);
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) return <ContentLoader />;
  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        {editable ? (
          <CustomButton variant="secondary" onClick={() => setEditable(false)}>
            Cancel
          </CustomButton>
        ) : (
          <CustomButton onClick={() => setEditable(true)} className="gap-2 text-white">
            <Pencil size={18} /> Edit
          </CustomButton>
        )}
      </div>

      {editable && (
        <>
          <div className="flex gap-6 items-center mb-4">
            <label className="text-base font-medium">Do you have GST?</label>
            <div className="flex gap-4">
              <CustomRadioButton
                label="Yes"
                name="have_gst"
                value="Yes"
                checked={profileData?.have_gst === "Yes"}
                onChange={() =>
                  setProfileData((prev) => ({
                    ...prev,
                    have_gst: "Yes",
                    have_pan: "Yes",
                  }))
                }
              />
              <CustomRadioButton
                label="No"
                name="have_gst"
                value="No"
                checked={profileData?.have_gst === "No"}
                onChange={() =>
                  setProfileData((prev) => ({
                    ...prev,
                    have_gst: "No",
                    gst: "",
                    tradename: "",
                    legalname: "",
                    have_pan: "",
                    pan: "",
                  }))
                }
              />
            </div>
          </div>

          {profileData?.have_gst === "No" && (
            <div className="flex gap-6 items-center mb-4">
              <label className="text-base font-medium">Do you have PAN?</label>
              <div className="flex gap-4">
                <CustomRadioButton
                  label="Yes"
                  name="have_pan"
                  value="Yes"
                  checked={profileData?.have_pan === "Yes"}
                  onChange={() =>
                    setProfileData((prev) => ({ ...prev, have_pan: "Yes" }))
                  }
                />
                <CustomRadioButton
                  label="No"
                  name="have_pan"
                  value="No"
                  checked={profileData?.have_pan === "No"}
                  onChange={() =>
                    setProfileData((prev) => ({
                      ...prev,
                      have_pan: "No",
                      pan: "",
                    }))
                  }
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileData?.have_gst === "Yes" && (
          <>
            <CustomInput
              label="GST Number"
              value={profileData?.gst || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  gst: e.target.value,
                }))
              }
              readOnly={!editable}
            />
            <CustomInput
              label="PAN Number"
              value={profileData?.pan || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  pan: e.target.value,
                }))
              }
              readOnly={!editable}
            />
            <CustomInput
              label="Legal Name"
              value={profileData?.legalname || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  legalname: e.target.value,
                }))
              }
              readOnly={!editable}
            />
            <CustomInput
              label="Trade Name"
              value={profileData?.tradename || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  tradename: e.target.value,
                }))
              }
              readOnly={!editable}
            />
          </>
        )}

        {profileData?.have_gst === "No" && profileData?.have_pan === "Yes" && (
          <>
            <CustomInput
              label="PAN Number"
              value={profileData?.pan || ""}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  pan: e.target.value,
                }))
              }
              readOnly={!editable}
            />
          </>
        )}

        {profileData?.have_gst === "No" && profileData?.have_pan === "No" && (
          <CustomInput
            label="Name"
            value={profileData?.name || ""}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, name: e.target.value }))
            }
            readOnly={!editable}
          />
        )}

        <CustomInput
          label="Primary Email"
          value={profileData?.email || ""}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, email: e.target.value }))
          }
          readOnly={!editable}
        />

        <CustomInput
          label="Billing Address"
          value={profileData?.address || ""}
          onChange={(e) =>
            setProfileData((prev) => ({ ...prev, address: e.target.value }))
          }
          readOnly={!editable}
        />

        {editable ? (
          <>
            <CustomDropdown
              label="State"
              name="state"
              options={stateList}
              value={profileData?.state || ""}
              onChange={(v) => {
                setSelectedState(v.value);
                setProfileData((prev) => ({
                  ...prev,
                  state: v.value,
                  state_name: v.label,
                  district: "",
                  district_name: "",
                  pincode: "",
                }));
              }}
            />
            <CustomDropdown
              label="District"
              name="district"
              options={districtList}
              value={profileData?.district || ""}
              onChange={(v) =>
                setProfileData((prev) => ({
                  ...prev,
                  district: v.value,
                  district_name: v.label,
                }))
              }
            />
          </>
        ) : (
          <>
            <CustomInput
              label="State"
              value={profileData?.state || ""}
              readOnly
            />
            <CustomInput
              label="District"
              value={profileData?.district || ""}
              readOnly
            />
          </>
        )}

        <CustomInput
          label="Pincode"
          value={profileData?.pincode || ""}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,6}$/.test(value)) {
              setProfileData((prev) => ({ ...prev, pincode: value }));
              if (value.length === 6) handlePinVerify(value);
            }
          }}
          readOnly={!editable}
        />
      </div>

      {editable && (
        <>
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="sameAsBilling"
              checked={isShippingSameAsBilling}
              onChange={(e) => handleShippingSameAsBilling(e.target.checked)}
            />
            <label htmlFor="sameAsBilling" className="text-sm font-medium">
              Shipping address is same as billing address
            </label>
          </div>

          {!isShippingSameAsBilling && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <CustomInput
                label="Shipping Address"
                value={profileData?.shipping_address || ""}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    shipping_address: e.target.value,
                  }))
                }
              />
              <CustomInput
                label="Shipping Landmark"
                value={profileData?.shipping_landmark || ""}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    shipping_landmark: e.target.value,
                  }))
                }
              />
              <CustomDropdown
                label="Shipping State"
                options={stateList}
                value={profileData?.shipping_state || ""}
                onChange={(v) =>
                  setProfileData((prev) => ({
                    ...prev,
                    shipping_state: v.value,
                    shipping_district: "",
                    shipping_pincode: "",
                  }))
                }
              />
              <CustomDropdown
                label="Shipping District"
                options={districtList}
                value={profileData?.shipping_district || ""}
                onChange={(v) =>
                  setProfileData((prev) => ({
                    ...prev,
                    shipping_district: v.value,
                  }))
                }
              />
              <CustomInput
                label="Shipping Pincode"
                value={profileData?.shipping_pincode || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) {
                    setProfileData((prev) => ({
                      ...prev,
                      shipping_pincode: value,
                    }));
                    if (value.length === 6) handlePinVerify(value, true);
                  }
                }}
              />
            </div>
          )}

          <div className="flex gap-6 items-center mb-4 mt-4">
            <label className="text-base font-medium">Credit Required</label>
            <div className="flex gap-4">
              <CustomRadioButton
                label="Yes"
                name="credit_required"
                value="Yes"
                checked={profileData?.credit_required === "Yes"}
                onChange={() =>
                  setProfileData((prev) => ({
                    ...prev,
                    credit_required: "Yes",
                  }))
                }
              />
              <CustomRadioButton
                label="No"
                name="credit_required"
                value="No"
                checked={profileData?.credit_required === "No"}
                onChange={() =>
                  setProfileData((prev) => ({
                    ...prev,
                    credit_required: "No",
                  }))
                }
              />
            </div>
          </div>
        </>
      )}

      <div className="flex justify-center w-full mt-6">
        <CustomButton
          onClick={handleUpdate}
          disabled={isUpdating || gstLoading}
          className="text-white"
        >
          {isUpdating || gstLoading ? "Processing..." : "Submit"}
        </CustomButton>
      </div>
    </div>
  );
};

export default ProfileInformation;
