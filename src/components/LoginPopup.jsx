import { ArrowRight, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ButtonLoader } from "./PageLoader";
import CustomModal from "./CustomModal";

const base_url = "https://gaswale.vensframe.com/api/";

export const Login = ({ isOpen  ,onClose,onSuccess}) => {
  const [verifyData, setVerifyData] = useState({});
  const [userName, setUserName] = useState("");
  const [code, setCode] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `/* CSS animations here */`;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    setUserName("");
    setCode("");
    setShowOtp(false);
    setShowPass(false);
    setPassword("");
    document.body.style.overflowY = "hidden";
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  const validateInput = (input) => {
    const mobileRegex = /^[0-9]{10}$/;
    const userIdRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (mobileRegex.test(input)) return { valid: true, type: "mobile" };
    if (userIdRegex.test(input)) return { valid: true, type: "userid" };
    return { valid: false, type: "invalid" };
  };

  const verifyUser = async () => {
    if (!userName)
      return toast.info("Please enter your User ID or Mobile Number");
    setLoading(true);
    const { valid, type } = validateInput(userName);
    if (!valid) {
      toast.info(
        type === "mobile" ? "Invalid Mobile Number" : "Invalid User ID"
      );
      return;
    }
    try {
      const body = new FormData();
      body.append("username", userName);

      const res = await axios.post(base_url + "customer/verify_user", body, {
        method: {
          "Content-Type": "multipart/form-data",
        },
      });

      const response = await res.data;
      if (response.success) {
        setVerifyData(response.data);
        type == "mobile" && toast.success(response.message);
        if (type === "userid") setShowPass(true);
        if (type === "mobile") setShowOtp(true);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to get OTP");
    }
    setLoading(false);
  };

  const login = async () => {
    if (!userName)
      return toast.info("Please enter your User ID or Mobile Number");

    const { valid, type } = validateInput(userName);
    if (!valid) {
      toast.info(
        type === "mobile" ? "Invalid Mobile Number" : "Invalid User ID"
      );
      return;
    }

    if (showOtp && !code) return toast.info("Please enter OTP");
    if (showPass && !password) return toast.info("Please enter Password");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", userName);
      if (showOtp) {
        formData.append("otp", code);
        formData.append("userid", verifyData?.id);
      }
      if (showPass) {
        formData.append("userid", "");
        formData.append("password", password);
      }

      const res = await axios.post(base_url + "customer/login", formData, {
        method: {
          "Content-Type": "multipart/form-data",
        },
      });
      const response = await res.data;
      if (response.success) {
        localStorage.setItem("customer", JSON.stringify(response));
        toast.success(response.message);
        //  onClose()
          //  window.location.reload(); // <--- Add this line

        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };


  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg p-3">
    <div className="flex justify-between items-center border-b pb-3 mb-4">
      <div className="flex items-center space-x-3">
        <User />
        <h2 className="text-lg font-semibold text-gray-800">Login/Register</h2>
      </div>
      {/* Optional Close Icon */}
      {/* <X onClick={() => setIsOpen(false)} className="cursor-pointer text-gray-500 hover:text-gray-800" /> */}
    </div>

    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email/Mobile
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email or mobile number"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={showOtp || showPass}
        />
      </div>

      {showPass && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      )}

      {showOtp && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OTP
          </label>
          <input
            type="text"
            maxLength={4}
            className="w-full px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            className="mt-2 text-sm text-blue-600 underline"
            onClick={verifyUser}
          >
            Resend OTP
          </button>
        </div>
      )}

      <button
        type="submit"
        onClick={() => (showOtp || showPass ? login() : verifyUser())}
        className="w-full flex items-center justify-center gap-2 bg-[#169e49] text-white py-2 rounded-md hover:bg-green-700 transition-all"
      >
        {loading ? <ButtonLoader /> : <>
          <ArrowRight size={20} />
          <span className="font-medium">Continue</span>
        </>}
      </button>
    </form>
  </div>

  );
};