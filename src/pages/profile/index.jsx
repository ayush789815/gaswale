import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import ProfileInformation from "./ProfileInformation";
import Address from "./Address";
import Refferal from "./Refferal";
import UserIDPassword from "./UserIDPassword";

const tabs = [
  "Profile Information",
  "Address",
  "User id & Password",
  "Refferal",
  // "Branches" // Optional
];

const Profile = () => {
  const [itemLink, setItemLink] = useState("Profile Information");

  const renderComponent = () => {
    switch (itemLink) {
      case "Profile Information":
        return <ProfileInformation />;
      case "Address":
        return <Address />;
      case "User id & Password":
        return <UserIDPassword />;
      case "Refferal":
        return <Refferal />;
      // case "Branches":
      //   return <Branches />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[90%] mx-auto m-5">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex border border-gray-800/15 rounded-md">
        <div className="w-[16rem] p-5 border-r border-gray-800/15">
          <ul className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`flex justify-between px-3 py-2 cursor-pointer text-md font-medium rounded-md items-center ${
                  itemLink === tab
                    ? "bg-[#216d13] text-white"
                    : "bg-[#f0f5f2] text-[#169e49]"
                }`}
                onClick={() => setItemLink(tab)}
              >
                <p>{tab}</p>
                <ChevronRight size={20} />
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 w-full overflow-x-auto">
          <div className="max-w-full">{renderComponent()}</div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden flex flex-col gap-4">
        <div className="overflow-x-auto border border-gray-300 rounded-md">
          <ul className="flex whitespace-nowrap">
            {tabs.map((tab) => (
              <li
                key={tab}
                className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                  itemLink === tab
                    ? "bg-[#216d13] text-white"
                    : "bg-[#f0f5f2] text-[#169e49]"
                }`}
                onClick={() => setItemLink(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>
        <div>{renderComponent()}</div>
      </div>
    </div>
  );
};

export default Profile;


// /* 01 Profile Information Component css */
// .PI {
//     width: 100%;
//     padding: 1rem;
//     display: flex;
//     flex-direction: column;
//     justify-content: flex-start;
//     align-items: flex-start;
// }

// .PI-edit {
//     width: 100%;
//     display: flex;
//     justify-content: flex-end;
//     align-items: flex-end;
// }

// .PI-edit-btn {
//     display: flex;
//     border: none;
//     background-color: white;
//     justify-content: center;
//     align-items: center;
//     font-size: 15px;
//     cursor: pointer;
// }

// .PI-edit-btn>i {
//     padding-left: .5rem;
// }

// .PI-form {
//     width: 100%;
//     display: flex;
//     flex-direction: row;
//     flex-wrap: wrap;
// }

// .PI-form-div {
//     width: 50%;
//     margin: .5rem 0;
// }

// .PI-form-div>p {
//     margin: 0;
//     padding: .35rem 0;
//     font-size: 15px;
// }

// .PI-input {
//     width: 95%;
//     box-sizing: border-box;
//     padding: .5rem .25rem;
//     border: none;
//     border-radius: .15rem;
//     font-size: 15px;
//     background-color: rgb(238, 231, 231);
// }

// .PI-input:focus {
//     outline: 2px solid rgb(55, 189, 241);
//     transition: .25s;
//     background-color: rgb(238, 231, 231);

// }

// .PI-update-div {
//     width: 100%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     margin: 1rem 0 0 0;
// }

// .PI-update-btn {
//     display: flex;
//     border: none;
//     padding: .35rem .5rem;
//     color: white;
//     border-radius: .25rem;
//     background-color: #198754;
//     justify-content: center;
//     align-items: center;
//     font-size: 15px;
//     cursor: pointer;
// }

// /* 02 Address component css*/

// .Add {
//     /* margin: 2rem 1rem 1rem 1rem;
//     padding: 1rem 2rem 1rem 2rem; */
//     /* width: calc(100% - 6rem); */
//     width: 100%;
//     display: flex;
//     flex-direction: column;
//     justify-content: flex-start;
//     align-items: flex-start;
//     /* border: 1px solid rgba(0, 0, 0, 0.155); */
// }

// .Add-02nd {
//     width: 100%;
//     margin: 1rem 0;
//     display: flex;
//     justify-content: flex-end;
//     align-items: flex-end;
// }

// .Add-02nd-btn {
//     background-color: #0d6efd;
//     padding: 0.45rem 0.5rem;
//     cursor: pointer;
//     border: none;
//     border-radius: 0.25rem;
//     color: white;
// }

// .Add-03rd {
//     width: 250px;
//     padding: 1rem;
//     border: 1px solid rgba(0, 0, 0, 0.158);
//     border-radius: 0.25rem;
// }

// .Add-03rd1 {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
// }

// .Add-03rd1-title {}

// .Add-03rd2-icon {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
// }

// .Add-03rd1-title {
//     font-size: 18px;
// }

// .Add-icons1 {
//     padding: 0 0.12rem;
//     font-size: 20px;
//     cursor: pointer;

// }

// .Add-icons2 {
//     padding: 0 0.12rem;
//     color: red;
//     font-size: 20px;
//     cursor: pointer;
// }

// .Add-03rd2 {
//     display: flex;
//     flex-direction: column;
//     justify-content: flex-start;
//     align-items: flex-start;
//     overflow-y: scroll;
// }

// .Add-03rd2::-webkit-scrollbar {
//     display: none;
// }

// .Add-03rd3 {
//     margin: 1rem 0;
//     display: flex;
//     justify-content: space-between;
//     align-items: flex-start;
// }

// .Add-03rd3-switch {
//     font-size: 15px;
// }

// .Add-form {
//     width: 100%;
//     display: flex;
//     flex-direction: row;
//     flex-wrap: wrap;
// }

// .Add-form-div {
//     width: 50%;
//     margin: .25rem 0;
// }

// .Add-map-div-2 {
//     /* min-width: 1000px !important; */
//     margin: .5rem 0;
//     min-width: 100%;
// }

// .Add-form-div>p {
//     margin: 0;
//     padding: .35rem 0;
//     font-size: 15px;
// }

// .Add-input {
//     width: 90%;
//     box-sizing: border-box;
//     padding: .4rem .5rem;
//     border: none;
//     font-size: 15px;
//     border-radius: .15rem;
//     border: 1px solid rgba(0, 0, 0, 0.200);
//     background-color: white;
// }

// .Add-input:focus {
//     outline: 2px solid rgb(55, 189, 241);
//     transition: .25s;
//     background-color: white;

// }

// .Add-update-div {
//     width: 100%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     margin: 1rem 0 0 0;
// }

// .Add-update-btn {
//     display: flex;
//     border: none;
//     padding: .35rem .5rem;
//     color: white;
//     border-radius: .25rem;
//     background-color: #198754;
//     justify-content: center;
//     align-items: center;
//     font-size: 15px;
//     cursor: pointer;
// }

// .Add-map-btn {
//     display: flex;
//     border: none;
//     padding: .4rem .5rem;
//     color: white;
//     border-radius: .25rem;
//     background-color: #0d6efd;
//     justify-content: center;
//     align-items: center;
//     font-size: 15px;
//     cursor: pointer;
// }

// .Add-map-btn>p {
//     padding: 0;
//     margin: 0;
//     padding-left: .5rem;
// }

// .visiblity-none {
//     visibility: hidden;
// }

// /* 03 Authentication component css */

// .Auth {
//     width: 100%;
//     padding: 1rem;
//     display: flex;
//     flex-direction: column;
//     justify-content: flex-start;
//     align-items: flex-start;
// }

// .Auth-edit {
//     width: 100%;
//     display: flex;
//     justify-content: flex-end;
//     align-items: flex-end;
// }

// .Auth-edit-btn {
