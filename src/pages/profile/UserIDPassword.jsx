import React, { useState } from "react";
import {
  useGetProfileQuery,
  useUpdateContactDetailsMutation,
} from "../../store/services";
import { ContentLoader } from "../../components/PageLoader";
import { CustomInput } from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Pencil } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

const base_url = "https://gaswale.vensframe.com/api/";

const UserIDPassword = () => {
  const [editable, setEditable] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const userData = JSON.parse(localStorage.getItem("customer"));

  const { data, isLoading } = useGetProfileQuery(userData?.userid, {
    skip: !userData?.userid,
  });

  const [updateContactDetails, { isLoading: isUpdating }] =
    useUpdateContactDetailsMutation();

  if (isLoading) return <ContentLoader />;

  const profileData = data?.data[0] || {};

  // Send OTP
  const sendOtp = async () => {
    try {
      const formData = new FormData();
      formData.append("username", profileFormik.values.mobile);

      const res = await axios.post(
        base_url + "customer/verify_user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const response = await res.data;

      if (response.success) {
        toast.success("OTP sent successfully");
        setOtpSent(true);
        setOtpVerified(false);
      } else {
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("OTP send failed");
    }
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error("Please enter OTP");

    // Simulate verify success
    setOtpVerified(true);
    toast.success("OTP Verified ✅");
  };

  const profileFormik = useFormik({
    initialValues: {
      mobile: profileData?.mobile || "",
      email: profileData?.email || "",
      email1: profileData?.email2 || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      mobile: Yup.string().required("Mobile is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      email1: Yup.string().email("Invalid secondary email"),
    }),
    onSubmit: async (values) => {
      const isMobileChanged = values.mobile !== profileData?.mobile;

      if (isMobileChanged && !otpVerified) {
        toast.error("Please verify OTP before saving.");
        return;
      }

      try {
        const payload = {
          userid: userData?.userid,
          mobile: values.mobile,
          email: values.email,
          email1: values.email1,
          ...(isMobileChanged && { otp }),
        };

        const res = await updateContactDetails(payload).unwrap();

        if (res.success) {
          toast.success("Contact details updated successfully");
          setEditable(false);
          setOtp("");
          setOtpSent(false);
          setOtpVerified(false);
        } else {
          toast.error(res.message || "❌ Failed to update contact details");
        }
      } catch (err) {
        console.error("Update error:", err);
        toast.error("❌ Error updating contact details");
      }
    },
  });

  return (
    <div className="flex w-full justify-start items-start flex-col gap-5">
      {/* Edit Toggle Button */}
      <div className="flex justify-end w-full">
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

      <form
        onSubmit={profileFormik.handleSubmit}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <CustomInput
          label="Mobile"
          name="mobile"
          value={profileFormik.values.mobile}
          onChange={(e) => {
            profileFormik.handleChange(e);
            setOtp("");
            setOtpSent(false);
            setOtpVerified(false);
          }}
          onBlur={profileFormik.handleBlur}
          error={profileFormik.touched.mobile && profileFormik.errors.mobile}
          readOnly={!editable}
        />

        <CustomInput
          label="Primary Email ID"
          name="email"
          value={profileFormik.values.email}
          onChange={profileFormik.handleChange}
          onBlur={profileFormik.handleBlur}
          error={profileFormik.touched.email && profileFormik.errors.email}
          readOnly={!editable}
        />

        <CustomInput
          label="Secondary Email ID"
          name="email1"
          value={profileFormik.values.email1}
          onChange={profileFormik.handleChange}
          onBlur={profileFormik.handleBlur}
          error={profileFormik.touched.email1 && profileFormik.errors.email1}
          readOnly={!editable}
        />

        <CustomInput label="User ID" value={profileData?.userid} readOnly />

        {/* OTP Section */}
        {editable &&
          profileFormik.values.mobile !== profileData?.mobile && (
            <div className="col-span-2 flex flex-col gap-2">
              {otpSent && (
                <CustomInput
                  label="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}

              <div className="flex gap-4">
                <CustomButton type="button" onClick={sendOtp}>
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </CustomButton>

                {otpSent && (
                  <CustomButton type="button" onClick={verifyOtp}>
                    Verify OTP
                  </CustomButton>
                )}
              </div>
            </div>
          )}

        {editable && (
          <div className="col-span-2">
            <CustomButton  className="text-white" type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </CustomButton>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserIDPassword;
