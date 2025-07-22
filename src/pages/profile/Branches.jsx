import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomButton from "../../components/CustomButton";
import { useGetAddressListQuery } from "../../store/services";
import { ContentLoader } from "../../components/PageLoader";
import AddBranch from "./AddBranch";

const branches = [
  {
    id: 1,
    location: "Borabanda",
    email: "ganeshkg@veramasa.com",
    mobile: "8887778881",
  },
  {
    id: 2,
    location: "borabanda",
    email: "vgvrrr@gfgf",
    mobile: "7673919398",
  },
  {
    id: 3,
    location: "madhapur",
    email: "ganeshk@veramasa.com",
    mobile: "767225458",
  },
  {
    id: 4,
    location: "madhapur-1",
    email: "deepikaa4114@com",
    mobile: "8765434567",
  },
  {
    id: 5,
    location: "madhapur-3",
    email: "ganeshk@veramasa.com",
    mobile: "7673956513",
  },
  {
    id: 6,
    location: "madhapur-4",
    email: "ganeshkgg@veramasa.com",
    mobile: "7673165163",
  },
  {
    id: 7,
    location: "madhapur-3",
    email: "g@veramasamail.com",
    mobile: "7465256456",
  },
  {
    id: 8,
    location: "madhapur-123",
    email: "Ganesh@veramasamail.com",
    mobile: "7541232318",
  },
  {
    id: 9,
    location: "borabanda",
    email: "ganeshk@veramasa.com",
    mobile: "1234567899",
  },
  {
    id: 10,
    location: "veramasa123",
    email: "ganeshk@veramasa.com",
    mobile: "1234567881",
  },
  {
    id: 11,
    location: "boran133",
    email: "ganeshk#@gmail.com",
    mobile: "7676464646",
  },
  {
    id: 12,
    location: "borabanda1235",
    email: "ganeshk#$@veramasa.com",
    mobile: "1351313544",
  },
  {
    id: 13,
    location: "test",
    email: "deepikaa4114@gmail.com",
    mobile: "7787664455",
  },
];

const Branches = () => {
  const [showAdd, setShowAdd] = useState(false);
  const userData = JSON.parse(localStorage.getItem("customer"));
  const { data, isLoading, isError, error } = useGetAddressListQuery(
    userData?.userid,
    {
      skip: !userData?.userid, // skips fetch if userid not ready
    }
  );

  if (isLoading) {
    return <ContentLoader />;
  }
  return (
    <div className="p-4 overflow-x-auto w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#169e49]">Branch List</h2>
        {showAdd || (
          <CustomButton onClick={() => setShowAdd(true)}>
            Add Branch
          </CustomButton>
        )}
        {showAdd && (
          <CustomButton onClick={() => setShowAdd(false)} variant="secondary">
            Cancel
          </CustomButton>
        )}
      </div>

      {showAdd || (
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-2 border-b border-b-gray-200">Sl. No</th>
              <th className="px-4 py-2 border-b border-b-gray-200">
                Location Code
              </th>
              <th className="px-4 py-2 border-b border-b-gray-200">Email</th>
              <th className="px-4 py-2 border-b border-b-gray-200">Mobile</th>
              <th className="px-4 py-2 border-b border-b-gray-200 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch, index) => (
              <tr
                key={branch.id}
                className="hover:bg-gray-border-b-gray-200 transition"
              >
                <td className="px-4 py-2 border-b border-b-gray-200">
                  {index + 1}
                </td>
                <td className="px-4 py-2 border-b border-b-gray-200">
                  {branch.location}
                </td>
                <td className="px-4 py-2 border-b border-b-gray-200">
                  {branch.email}
                </td>
                <td className="px-4 py-2 border-b border-b-gray-200">
                  {branch.mobile}
                </td>
                <td className="px-4 py-2 border-b border-b-gray-200 text-center space-x-2">
                  <button className="text-gray-600 hover:text-blue-600">
                    <Eye size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-green-600">
                    <Pencil size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAdd && (
        <div className="flex w-full">
          <AddBranch />
        </div>
      )}
    </div>
  );
};

export default Branches;
