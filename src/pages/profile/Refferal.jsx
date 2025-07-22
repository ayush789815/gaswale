import React, { useState } from "react";
import { Copy } from "lucide-react";
import { useGetProfileQuery } from "../../store/services";
import { ContentLoader } from "../../components/PageLoader";
import { toast } from "react-toastify";
import axios from "axios";

const base_url = "https://gaswale.vensframe.com/api/";

const Refferal = () => {
  const userData = JSON.parse(localStorage.getItem("customer"));
  const { data, isLoading, refetch } = useGetProfileQuery(userData?.userid, {
    skip: !userData?.userid,
  });

  const [referralInput, setReferralInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [referrerName, setReferrerName] = useState("");

  if (isLoading) return <ContentLoader />;

  const profileData = data?.data?.[0] || {};
  const referredList = data?.referred_list || [];

  const isAlreadyReferred = profileData?.referredbyname;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileData?.customer_referral_code);
    toast("Copied!", {
      toastId: 1,
      delay: 1,
      autoClose: 1500,
    });
  };

  const verifyReferral = async () => {
    if (!referralInput) {
      toast.error("Please enter referral code");
      return;
    }

    setLoading(true);

    try {
      const verifyForm = new FormData();
      verifyForm.append("userid", userData?.userid);
      verifyForm.append("referralcode", referralInput);
      verifyForm.append("ingress", "4");

      const response = await axios.post(
        base_url + "verify-referral.php",
        verifyForm
      );

      const result = response.data;
      setLoading(false);

      if (result.success) {
        if (!isAlreadyReferred) {
          toast.success("Referral verified successfully!");
        }
        setReferrerName(result?.user?.name || "Referred User");
        refetch();
      } else {
        toast.error(result.message || "Invalid referral code");
      }
    } catch (error) {
      console.error("Referral verify error:", error);
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Referral Code Display */}
      <div className="border border-gray-300 rounded-md p-4">
        <h2 className="text-xl font-semibold mb-2">Refer to</h2>
        <p className="text-sm">
          Your referral code is:
          <span className="text-green-600 font-semibold mx-1">
            {profileData?.customer_referral_code}
          </span>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center"
          >
            <Copy
              size={16}
              className="text-gray-500 hover:text-black cursor-pointer"
            />
          </button>
        </p>
      </div>

      {/* Referred By Section */}
      <div className="border border-gray-300 rounded-md p-4">
        <p className="text-sm font-medium text-gray-800 mb-2">
          You are Referred By:
        </p>

        {isAlreadyReferred || referrerName ? (
          <p className="text-sm font-semibold text-green-700">
            ✅ Referred by:{" "}
            <span className="text-black">
              {referrerName || profileData?.referredbyname}
            </span>
          </p>
        ) : (
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={referralInput}
              onChange={(e) =>
                setReferralInput(e.target.value.toUpperCase())
              }
              className="border border-gray-400 rounded px-3 py-2 text-sm w-full max-w-xs"
              placeholder="Enter referral code"
            />
            <button
              onClick={verifyReferral}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}
      </div>

      {/* Referred Users Table */}
      <div className="border border-gray-300 rounded-md p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-2">
          Users You Referred:
        </h3>

        {referredList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead>
                <tr className="bg-[#00B63F] text-left text-white">
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {referredList.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.name?.trim() ? user.name : "NA"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{user.mobile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No one has used your referral yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Refferal;
