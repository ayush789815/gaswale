import React, { useEffect, useState } from "react";
import CustomRadioButton from "../../components/CustomRadioButton";
import { CustomInput } from "../../components/CustomInput";
import { toast } from "react-toastify";

const base_url2 = "https://gaswale.vensframe.com/api/";

const Credit = () => {
  const userId = JSON.parse(localStorage.getItem("customer"))?.userid;

  const [creditChoice, setCreditChoice] = useState(null);
  const [sameAddress, setSameAddress] = useState(true);
  const [aadharFile, setAadharFile] = useState(null);
  const [ifscLoading, setIfscLoading] = useState(false);
  const [creditStatus, setCreditStatus] = useState(null);
  const [creditDetails, setCreditDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    estimate: "",
    assured: "",
    days: "",
    credit_limit: "",
    name: "",
    type: "",
    number: "",
    confirm_number: "",
    ifsc: "",
    b_name: "",
    branch: "",
  });

  // Credit days options
  const creditDaysOptions = [
    { value: "", label: "Select Days" },
    { value: "7", label: "7 days" },
    { value: "15", label: "15 days" },
    { value: "30", label: "30 days" },
    { value: "45", label: "45 days" },
    { value: "60", label: "60 days" },
  ];

  useEffect(() => {
    if (!userId) return;
    fetchCreditDetails();
  }, [userId]);

  const fetchCreditDetails = async () => {
    try {
      const body = new FormData();
      body.append("userid", userId);
      body.append("page", "1");
      body.append("limit", "10");
      body.append("type", "1");

      const response = await fetch(base_url2 + "customer/orderslist", {
        method: "POST",
        body,
      });

      const res = await response.json();
      if (res?.success !== undefined) {
        const creditStatusNumber = parseInt(res.credit);
        setCreditStatus(creditStatusNumber);
        if (res.data && res.data.length > 0) {
          setCreditDetails(res.data[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching credit details:", err);
    }
  };

  const updateCreditChoice = async (choice) => {
    try {
      const body = new FormData();
      body.append("userid", userId);
      body.append("credit", choice === "Yes" ? 1 : 0);

      const response = await fetch(base_url2 + "customer/credit_update", {
        method: "POST",
        body,
      });

      const res = await response.json();
      if (res.success) {
        toast.success("✅ Credit choice updated");
        fetchCreditDetails();
      } 
    } catch (err) {
      toast.error("❌ Network error");
      console.error("updateCreditChoice error:", err);
    }
  };

  const check_ifsc = async (code, setLoading) => {
    try {
      const body = new FormData();
      body.append("ifsc", code);
      setLoading(true);
      const response = await fetch(base_url2 + "customer/verifyifsc", {
        method: "POST",
        body,
      });
      const res = await response.json();
      setLoading(false);
      return res;
    } catch (error) {
      setLoading(false);
      console.error("IFSC API Error:", error);
    }
  };

  useEffect(() => {
    const fetchIFSC = async () => {
      if (form.ifsc.length === 11) {
        const res = await check_ifsc(form.ifsc, setIfscLoading);
        if (res?.success && res.data) {
          setForm((prev) => ({
            ...prev,
            b_name: res.data.bank || "",
            branch: res.data.branch || "",
          }));
          toast.success("✅ IFSC verified & bank details filled");
        } else {
          toast.error("❌ Invalid IFSC Code");
          setForm((prev) => ({ ...prev, b_name: "", branch: "" }));
        }
      }
    };
    fetchIFSC();
  }, [form.ifsc]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAadharFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (!userId) return toast.error("User not found");

    try {
      const body = new FormData();
      body.append("userid", userId);
      body.append("credit", creditChoice === "Yes" ? 1 : 0);

      if (creditChoice === "Yes") {
        body.append("tvolume", form.estimate);
        body.append("avolume", form.assured);
        body.append("cdays", form.days);
        body.append("climit", form.credit_limit);
        body.append("name", form.name);
        body.append("btype", form.type);
        body.append("bnumber", form.number);
        body.append("bnumber1", form.confirm_number);
        body.append("bifsc", form.ifsc);
        body.append("bname", form.b_name);
        body.append("bbranch", form.branch);
        if (aadharFile) body.append("aadhar", aadharFile);
        body.append("addSameId", sameAddress ? 1 : 0);
      }

      const response = await fetch(base_url2 + "customer/credit_update", {
        method: "POST",
        body,
      });

      const res = await response.json();
      if (res.success) {
        toast.success("✅ Credit updated successfully");
        fetchCreditDetails();
        setShowForm(false);
        setCreditChoice(null);
      } else {
        toast.error("❌ Credit update failed");
      }
    } catch (error) {
      console.error("Error updating credit:", error);
      toast.error("❌ Failed to update credit info");
    }
  };

  if (creditStatus === null) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Loading...</h2>
      </div>
    );
  }

  if (creditStatus === 0 && creditDetails) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-4">Credit Details Submitted</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Estimated:</strong> {creditDetails.tvolume}
          </p>
          <p>
            <strong>Assured:</strong> {creditDetails.avolume}
          </p>
          <p>
            <strong>Credit Days:</strong> {creditDetails.cdays}
          </p>
          <p>
            <strong>Credit Limit:</strong> ₹{creditDetails.climit}
          </p>
          <p>
            <strong>Account Holder:</strong> {creditDetails.name}
          </p>
          <p>
            <strong>Bank Type:</strong> {creditDetails.btype}
          </p>
          <p>
            <strong>Account Number:</strong> {creditDetails.bnumber}
          </p>
          <p>
            <strong>IFSC:</strong> {creditDetails.bifsc}
          </p>
          <p>
            <strong>Bank:</strong> {creditDetails.bname}
          </p>
          <p>
            <strong>Branch:</strong> {creditDetails.bbranch}
          </p>
        </div>
      </div>
    );
  } else if (creditStatus === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-center text-red-500 font-semibold text-xl">
          Your Credit request has been rejected
        </h2>
      </div>
    );
  } else if (creditStatus === 2) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-center text-yellow-600 font-semibold text-xl">
          Your Credit request is under process
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl  p-6">
      <h2 className="text-xl font-semibold mb-4">Credit Required?</h2>
      <div className="flex gap-6 mb-6">
        <label className="flex items-center gap-2">
          <CustomRadioButton
            type="radio"
            name="credit"
            value="Yes"
            checked={creditChoice === "Yes"}
            onChange={() => {
              setCreditChoice("Yes");
              setShowForm(true);
            }}
          />
          Yes
        </label>
        <label className="flex items-center gap-2">
          <CustomRadioButton
            type="radio"
            name="credit"
            value="No"
            checked={creditChoice === "No"}
            onChange={() => {
              setCreditChoice("No");
              setShowForm(false);
              updateCreditChoice("No");
            }}
          />
          No
        </label>
      </div>

      {showForm && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Fill Credit Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-medium mb-1">
                Estimated monthly consumption(in Kg) *
              </label>
              <CustomInput
                name="estimate"
                value={form.estimate}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Assured monthly consumption(in Kg) *
              </label>
              <CustomInput
                name="assured"
                value={form.assured}
                onChange={handleChange}
                type="number"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Credit Day Required *
              </label>
              <select
                name="days"
                value={form.days}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {creditDaysOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">
                Credit Limit Required *
              </label>
              <CustomInput
                name="credit_limit"
                value={form.credit_limit}
                onChange={handleChange}
                type="number"
              />
            </div>
          </div>

          <h4 className="font-semibold text-lg mb-3">Bank Account Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block font-medium mb-1">
                Account Holder Name *
              </label>
              <CustomInput
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Account Type *</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="Saving">Saving</option>
                <option value="Current">Current</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Account Number *</label>
              <CustomInput
                name="number"
                value={form.number}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Confirm Account Number *
              </label>
              <CustomInput
                name="confirm_number"
                value={form.confirm_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">IFSC Code *</label>
              <CustomInput
                name="ifsc"
                value={form.ifsc}
                onChange={handleChange}
              />
              {ifscLoading && (
                <p className="text-sm text-blue-600">Verifying IFSC...</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">Bank Name *</label>
              <CustomInput
                name="b_name"
                value={form.b_name}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Bank Branch *</label>
              <CustomInput
                name="branch"
                value={form.branch}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2">Id Proof (Aadhar)</label>

            <button
              type="button"
              onClick={() => document.getElementById("idProofInput").click()}
              className="px-4 py-2 outline outline-green-600 text-green-500 rounded hover:bg-blue-700"
            >
              Select ID
            </button>

            <input
              type="file"
              id="idProofInput"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={sameAddress}
              onChange={() => setSameAddress(!sameAddress)}
              className="mr-2"
            />
            <span>Address is same as in Aadhar</span>
          </div>

          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Credit;