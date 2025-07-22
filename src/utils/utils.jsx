import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Enhanced Indian price formatting function

const baseUrl = "https://gaswale.vensframe.com/api/"; // your base path for relative URLs

export const getImageUrl = (url) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  } else {
    return baseUrl + url;
  }
};
export const formatIndianPrice = (amount, showDecimals = "auto") => {
  if (!amount && amount !== 0) return "₹ 0";

  let formatOptions = {};

  if (showDecimals === "always") {
    // Always show 2 decimal places: 123.00
    formatOptions = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
  } else if (showDecimals === "never") {
    // Never show decimals: 123
    formatOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    };
  } else {
    // Auto mode - show decimals only if needed: 123.5 or 123
    formatOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    };
  }

  const formattedAmount = Number(amount).toLocaleString("en-IN", formatOptions);
  return `₹ ${formattedAmount}`;
};

// More comprehensive function with all options
export const formatPrice = (amount, options = {}) => {
  const {
    currency = "₹",
    decimals = "auto", // 'auto', 'always', 'never'
    minimumDecimals = 0,
    maximumDecimals = 2,
  } = options;

  if (!amount && amount !== 0) return `${currency} 0`;

  let formatOptions = {};

  switch (decimals) {
    case "always":
      formatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
      break;
    case "never":
      formatOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      };
      break;
    default: // 'auto'
      formatOptions = {
        minimumFractionDigits: minimumDecimals,
        maximumFractionDigits: maximumDecimals,
      };
  }

  const formattedAmount = amount.toLocaleString("en-IN", formatOptions);
  return `${currency} ${formattedAmount}`;
};

export const handlePDFDownLoad = async (orderid) => {
  const userData = JSON.parse(localStorage.getItem("customer"));
  const body = new FormData();
  body.append("userid", userData.userid);
  body.append("orderid", orderid);
  const response = await axios.post(
    "https://gaswale.vensframe.com/api/customer/orderpdf.php",
    body,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const urlPath = response.data.path;

  axios({
    url: urlPath,
    method: "GET",
    responseType: "blob",
  })
    .then((response) => {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${userData.userid}.pdf`; // Set the desired file name
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error downloading PDF:", error);
    });
};

export const verifyPincode = async ({ data, setLoading }) => {
  try {
    setLoading(true);
    const body = new FormData();
    body.append("pincode", data?.pincode);
    body.append("state", data?.state);

    const res = await axios.post(
      "https://gaswale.vensframe.com/api/customer/pincode_verify",
      body,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const response = await res.data;
    if (response.success) {
      toast.success(response.message);
      return true;
    } else {
      toast.error(response.message);
      return false;
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};
export const fetchGSTDetails = async (gstin, setLoading) => {
  try {
    setLoading(true);
    const body = new FormData();
    body.append("gstin", gstin);

    const response = await fetch("https://gaswale.vensframe.com/api/customer/gstfetch", {
      method: "POST",
      body: body,
    });

    const res = await response.json();
    setLoading(false);
    return res;
  } catch (error) {
    console.error("Error fetching GST details:", error);
    setLoading(false);
    return null;
  }
};


// // Usage examples:
// console.log(formatIndianPrice(123)); // ₹ 123
// console.log(formatIndianPrice(123, "always")); // ₹ 123.00
// console.log(formatIndianPrice(123.5, "always")); // ₹ 123.50
// console.log(formatIndianPrice(123.5, "never")); // ₹ 124
// console.log(formatIndianPrice(4477.5)); // ₹ 4,477.5

// // With options:
// console.log(formatPrice(123, { decimals: "always" })); // ₹ 123.00
// console.log(formatPrice(123.456, { decimals: "never" })); // ₹ 123
// console.log(formatPrice(123, { minimumDecimals: 2 })); // ₹ 123.00
