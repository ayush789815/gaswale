import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CustomInput } from "../../components/CustomInput";
import CustomDropdown from "../../components/CustomDropdown";
import CustomButton from "../../components/CustomButton";
import { useGetCompletelistQuery } from "../../store/services";
import { verifyPincode } from "../../utils/utils";
import { IconLoader } from "../../components/PageLoader";
import axios from "axios";

const AddBranch = () => {
  const [selectedstate, setSelectedstate] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [GSTLoading, setGSTLoading] = useState(false);

  const { data, isLoading, isError, refetch } = useGetCompletelistQuery(
    selectedstate,
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const response = data?.data?.reponselist || {};
  const stateList = response?.states?.map((v) => ({
    label: v.name,
    value: v?.code,
    data: v,
  }));
  const districtList = response?.districts?.map((v) => ({
    label: v.name,
    value: v?.id,
    data: v,
  }));
  const formik = useFormik({
    initialValues: {
      branchCode: "",
      gstNumber: "",
      panNumber: "",
      legalName: "",
      tradeName: "",
      address: "",
      state: "",
      stateName: "",
      district: "",
      districtName: "",
      pinCode: "",
      isValidPin: false,
      mobile: "",
      email: "",
      userId: "",
      password: "",
    },
    validationSchema: Yup.object({
      branchCode: Yup.string().required("Branch Code is required"),
      // gstNumber: Yup.string().required("GST Number is required"),
      gstNumber: Yup.string()
        .required("GST Number is required")
        .matches(
          /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
          "Invalid GST Number format"
        )
        .test(
          "gst-valid-check",
          "GST Number not found or invalid",
          async function (value) {
            const { path, createError } = this;

            if (!value || value.length !== 15) return true; // Skip if not 15 characters

            try {
              setGSTLoading(true);
              const body = new FormData();
              body.append("gstin", value);
              const response = await axios.post(
                "https://gaswale.vensframe.com/api/customer/gstfetch",
                body,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              // Handle both JSON and non-JSON response gracefully
              const data = response?.data;
              if (!data?.error) {
                return true;
              } else {
                return createError({
                  path,
                  message: "GST Number not found or invalid",
                });
              }
            } catch (error) {
              return createError({
                path,
                message: "Failed to validate GST Number. Please try again.",
              });
            } finally {
              setGSTLoading(false);
            }
          }
        ),

      panNumber: Yup.string()
        .required("PAN Number is required")
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number"),

      mobile: Yup.string()
        .required("Mobile is required")
        .matches(/^[6-9]\d{9}$/, "Invalid Mobile Number"),
      legalName: Yup.string().required("Legal Name is required"),
      tradeName: Yup.string().required("Trade Name is required"),
      address: Yup.string().required("Address is required"),
      state: Yup.string().required("State is required"),
      district: Yup.string().required("District is required"),
      pinCode: Yup.string()
        .required("Pin Code is required")
        .matches(/^\d{6}$/, "Pin Code must be 6 digits")
        .test("pin-verified", "Invalid Pin Code", function (value) {
          return this.parent.isValidPin !== false;
        }),
      email: Yup.string().email("Invalid Email").required("Email is required"),
      userId: Yup.string().required("User ID is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Submitted Values", values);
    },
  });
  const handlePinVerify = async (pin) => {
    const response = await verifyPincode({
      data: { pincode: pin, state: selectedstate },
      setLoading: setPinLoading,
    });
    if (!response) {
      formik.setFieldError("pinCode", "Invalid Pin Code");
      formik.setFieldValue("isValidPin", false);
    } else {
      formik.setFieldValue("isValidPin", true);
    }
  };
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
    >
      <CustomInput
        label="Branch Code/Name"
        placeholder="Enter Branch Code/Name"
        name="branchCode"
        value={formik.values.branchCode}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.branchCode && formik.errors.branchCode}
      />

      <CustomInput
        label="Branch GST Number"
        placeholder="Branch GST Number"
        name="gstNumber"
        value={formik.values.gstNumber}
        onChange={(e) => {
          const value = e.target.value.toUpperCase();
          if (/^[A-Z0-9]{0,15}$/.test(value)) {
            formik.setFieldValue("gstNumber", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.gstNumber && formik.errors.gstNumber}
        rightIcon={GSTLoading && <IconLoader />}
      />

      <CustomInput
        label="Branch PAN Number"
        placeholder="Branch PAN Number"
        name="panNumber"
        value={formik.values.panNumber}
        onChange={(e) => {
          const value = e.target.value.toUpperCase();
          if (/^[A-Z0-9]{0,10}$/.test(value)) {
            formik.setFieldValue("panNumber", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.panNumber && formik.errors.panNumber}
      />

      <CustomInput
        label="Branch Legal Name"
        placeholder="Branch Legal Name"
        name="legalName"
        value={formik.values.legalName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.legalName && formik.errors.legalName}
      />

      <CustomInput
        label="Branch Trade Name"
        placeholder="Branch Trade Name"
        name="tradeName"
        value={formik.values.tradeName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.tradeName && formik.errors.tradeName}
      />

      <CustomInput
        label="Branch Address"
        placeholder="Branch Address"
        name="address"
        value={formik.values.address}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.address && formik.errors.address}
      />

      <CustomDropdown
        placeholder="Select State"
        label="State"
        name="state"
        options={stateList}
        value={formik.values.state}
        onChange={(v) => {
          setSelectedstate(v.value);
          formik.setFieldValue("state", v.value);
          formik.setFieldValue("stateName", v.label);
          formik.setFieldValue("district", "");
          formik.setFieldValue("pinCode", "");
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.state && formik.errors.state}
      />
      <CustomDropdown
        isDisabled={!formik.values.state}
        placeholder="Select District"
        label="District"
        name="district"
        options={districtList}
        value={formik.values.district}
        onChange={(v) => {
          formik.setFieldValue("district", v.value);
          formik.setFieldValue("districtName", v.label);
          formik.setFieldValue("pinCode", "");
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.district && formik.errors.district}
      />

      <CustomInput
        disabled={!formik.values.district}
        placeholder="Enter Pin Code"
        label="Branch Pin Code"
        name="pinCode"
        value={formik.values.pinCode}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,6}$/.test(value)) {
            formik.setFieldValue("pinCode", value);
            if (value?.length === 6) {
              handlePinVerify(value);
            }
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.pinCode && formik.errors.pinCode}
        rightIcon={pinLoading && <IconLoader />}
      />

      <CustomInput
        label="Branch Mobile"
        placeholder="Enter Branch Mobile"
        name="mobile"
        value={formik.values.mobile}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,10}$/.test(value)) {
            formik.setFieldValue("mobile", value);
          }
        }}
        onBlur={formik.handleBlur}
        error={formik.touched.mobile && formik.errors.mobile}
      />

      <CustomInput
        label="Branch Email ID"
        placeholder="Branch Email ID"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && formik.errors.email}
      />

      <CustomInput
        label="Branch User ID"
        placeholder="Branch User ID"
        name="userId"
        value={formik.values.userId}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.userId && formik.errors.userId}
      />

      <CustomInput
        label="Branch Password"
        placeholder="Branch Password"
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && formik.errors.password}
      />

      <div className="md:col-span-2">
        <CustomButton type="submit">Submit</CustomButton>
      </div>
    </form>
  );
};

export default AddBranch;
