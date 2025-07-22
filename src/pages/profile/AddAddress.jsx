import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomInput } from "../../components/CustomInput";
import CustomDropdown from "../../components/CustomDropdown";
import {
  useGetCompletelistQuery,
  useGetProfileQuery,
  useCreateAddressMutation,
} from "../../store/services";
import { verifyPincode } from "../../utils/utils";
import { IconLoader } from "../../components/PageLoader";
import { toast } from "react-toastify";

const AddAddress = ({ setClose, isEdit, selectedData }) => {
  const [selectedstate, setSelectedstate] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [createAddress] = useCreateAddressMutation();

  const userData = JSON.parse(localStorage.getItem("customer"));
  const { data: profileData } = useGetProfileQuery(userData?.userid, {
    skip: !userData?.userid,
  });

  const profile = profileData?.data?.[0] || {};
  const { data } = useGetCompletelistQuery(selectedstate, {
    refetchOnMountOrArgChange: true,
  });

  const response = data?.data?.reponselist || {};
  const stateList = response?.states?.map((v) => ({
    label: v.name,
    value: v?.code,
  }));
  const districtList = response?.districts?.map((v) => ({
    label: v.name,
    value: v?.id,
  }));

  const formik = useFormik({
    initialValues: {
      unitName: "",
      receiverName: "",
      receiverMobile: "",
      address: "",
      landmark: "",
      state: "",
      district: "",
      pinCode: "",
      isValidPin: true,
      location: "",
    },
    validationSchema: Yup.object({
      unitName: Yup.string().required("Unit Name is required"),
      receiverName: Yup.string().required("Receiver Name is required"),
      receiverMobile: Yup.string()
        .required("Receiver Mobile Number is required")
        .matches(
          /^[6-9]\d{9}$/,
          "Mobile Number must be 10 digits and start with 6-9"
        ),
      address: Yup.string().required("Address is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required"),
      pinCode: Yup.string()
        .required("Pin Code is required")
        .matches(/^\d{6}$/, "Pin Code must be 6 digits")
        .test("pin-verified", "Invalid Pin Code", function () {
          return this.parent.isValidPin !== false;
        }),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = {
          userid: userData.userid,
          unitName: values.unitName,
          receiverName: values.receiverName,
          receiverMobile: values.receiverMobile,
          mobile: profile.mobile,
          address: values.address,
          landmark: values.landmark,
          state: values.state,
          district: values.district,
          pinCode: values.pinCode,
          location: "23.2599,77.4126", // ✅ Required field
          addressid: isEdit ? selectedData?.id : "",
        };

        const res = await createAddress(formData).unwrap();

        if (res.success) {
          toast.success(res.message || "Address saved successfully");
          setClose(false);
        } else {
          toast.error(res.message || "Failed to save address");
        }
      } catch (error) {
        console.error("Error creating address", error);
        toast.error("Something went wrong while saving the address.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!isEdit || !selectedData || !stateList?.length) return;

    const stateCode = stateList?.find(
      (v) => v.label?.toLowerCase() === selectedData?.state?.toLowerCase()
    )?.value;

    if (stateCode) {
      setSelectedstate(stateCode);
      formik.setValues({
        unitName: selectedData.unit_name || "",
        receiverName: selectedData.receiver_name || "",
        receiverMobile: selectedData.receiver_mobile || "",
        address: selectedData.address || "",
        landmark: selectedData.landmark || "",
        state: stateCode || "",
        district: selectedData.district || "",
        pinCode: selectedData.pincode || "",
        isValidPin: true,
        location: selectedData.location || "23.2599,77.4126",
      });
    }
  }, [isEdit, selectedData, stateList]);

  const handlePinVerify = async (pin) => {
    const response = await verifyPincode({
      data: { pincode: pin, state: selectedstate },
      setLoading: setPinLoading,
    });
    formik.setFieldValue("isValidPin", !!response);
    if (!response) {
      formik.setFieldError("pinCode", "Invalid Pin Code");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Unit Name"
          name="unitName"
          placeholder="Enter Unit Name"
          value={formik.values.unitName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.unitName && formik.errors.unitName}
        />
        <CustomInput
          label="Receiver Name"
          name="receiverName"
          placeholder="Enter Receiver Name"
          value={formik.values.receiverName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.receiverName && formik.errors.receiverName}
        />
        <CustomInput
          label="Receiver Mobile"
          name="receiverMobile"
          placeholder="Enter Mobile"
          value={formik.values.receiverMobile}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              formik.setFieldValue("receiverMobile", value);
            }
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.receiverMobile && formik.errors.receiverMobile}
        />
        <CustomInput
          label="Address"
          name="address"
          placeholder="Enter Address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address && formik.errors.address}
        />
        <CustomInput
          label="Landmark"
          name="landmark"
          placeholder="Enter Landmark"
          value={formik.values.landmark}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.landmark && formik.errors.landmark}
        />
        <CustomDropdown
          label="State"
          name="state"
          options={stateList}
          value={formik.values.state}
          onChange={(v) => {
            setSelectedstate(v.value);
            formik.setFieldValue("state", v.value);
            formik.setFieldValue("district", "");
            formik.setFieldValue("pinCode", "");
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.state && formik.errors.state}
        />
        <CustomDropdown
          label="District"
          name="district"
          options={districtList}
          value={formik.values.district}
          onChange={(v) => formik.setFieldValue("district", v.value)}
          onBlur={formik.handleBlur}
          error={formik.touched.district && formik.errors.district}
        />
        <CustomInput
          label="Pin Code"
          name="pinCode"
          placeholder="Enter Pin Code"
          value={formik.values.pinCode}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,6}$/.test(value)) {
              formik.setFieldValue("pinCode", value);
              if (value.length === 6) {
                handlePinVerify(value);
              }
            }
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.pinCode && formik.errors.pinCode}
          rightIcon={pinLoading && <IconLoader />}
        />
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="bg-[#169e49] hover:bg-[#12833d] text-white px-5 py-2 rounded-md"
        >
          {formik.isSubmitting
            ? "Saving..."
            : isEdit
            ? "Update Address"
            : "Add Address"}
        </button>
      </div>
    </form>
  );
};

export default AddAddress;
