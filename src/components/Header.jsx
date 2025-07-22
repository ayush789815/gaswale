// components/Header.jsx - Sticky Header Component
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Login } from "./LoginPopup";
import { SelectCity } from "./SelectCityPopup";
import {
  ArrowUp,
  Bell,
  ChevronDown,
  LogOut,
  ShoppingCart,
  User,
} from "lucide-react";
import CustomModal from "./CustomModal";
import MenuBar from "./MenuBar";
import MultiLevelMenu from "./MultiLevelMenu";
import { useGetCartQuery } from "../store/cartApi";
import {
  useGetNotificationsQuery,
  useUpdateNotificationSeenStatusMutation,
} from "../store/services";
import { format } from "date-fns";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [showNotifyPanel, setShowNotifyPanel] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const userData = JSON.parse(localStorage.getItem("customer"));
  const { data: cartData, refetch: refetchCart } = useGetCartQuery(
    { userId: userData?.userid },
    {
      skip: !userData?.userid,
    }
  );
  const navigate = useNavigate();

  const [updateNotificationSeenStatus] =
    useUpdateNotificationSeenStatusMutation();

  const {
    data: notificationsData,
    isLoading: isNotificationsLoading,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(
    {
      userid: userData?.userid,
      ingress: 4,
    },
    { skip: !userData?.userid }
  );

  useEffect(() => {
    if (notificationsData?.data) {
      setNotifications(notificationsData.data);
      setUnseenCount(Number(notificationsData.totalunseencount || 0));
    }
  }, [notificationsData]);

  const selectedNotificationDetail =
    selectedNotificationId &&
    notifications.find((n) => n.id === selectedNotificationId);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") == "true";
    setIsLoggedIn(loginStatus);
  }, []);
  const handleNotificationClick = (notification) => {
    setSelectedNotificationId(notification.id);

    if (userData?.userid) {
      updateNotificationSeenStatus({
        userid: userData?.userid,
        id: notification.id,
        status: 1,
      });
    }
  };

  const handleBackToNotifications = () => {
    setSelectedNotificationId(null);
  };

  const toggleNotificationPanel = () => {
    setShowNotifyPanel((prev) => !prev);
    if (!showNotifyPanel) {
      // Refresh notifications when opening panel
      refetchNotifications();
    } else {
      setSelectedNotificationId(null);
    }
  };
  const [showLogin, setShowLogin] = useState(false);
  const [showCity, setShowCity] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
  };

  // const closeLogin = () => {
  //   setShowLogin(false);
  // };

  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [selectedCity, setSelectedCity] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [cartCount, setCartCount] = useState(0);
  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  // const [showNotifyDropdown, setShowNotifyDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userLoggedIn = JSON.parse(localStorage.getItem("customer"));

  // Refs
  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);
  const notifyPanelRef = useRef(null);
  // const notifyDropdownRef = useRef(null);

  // Login form state
  // const [loginForm, setLoginForm] = useState({
  //   email: "",
  //   password: "",
  // });

  // Search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchKeyword)}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setShowSuggestions(value.length > 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("customer");
    setShowUserDropdown(false);
    navigate("/");
  };

  // Mock search suggestions
  const searchSuggestions = [
    "LPG Cylinder 14.2kg",
    "HPCL Gas Cylinder",
    "Gas Regulator",
    "Gas Stove",
  ].filter((item) => item.toLowerCase().includes(searchKeyword.toLowerCase()));

  const Product = {
    LPG: ["All", "BPCL"], // duplicates handled
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
      if (
        notifyPanelRef.current &&
        !notifyPanelRef.current.contains(event.target)
      ) {
        setShowNotifyPanel(false);
        setSelectedNotificationId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      {/* Sticky Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-green-600/95 backdrop-blur-sm shadow-lg"
            : "bg-[#169e49]"
        }`}
      >
        {/* Main Navigation */}
        <nav className="w-full">
          <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0">
                <Link
                  to="/"
                  className="flex items-center text-white hover:text-green-100 transition-colors duration-200"
                >
                  <span className="text-xl font-bold">Gaswale</span>
                </Link>
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden sm:block flex-1 max-w-sm mx-8">
                <div className="relative" ref={searchRef}>
                  <form onSubmit={handleSearch} className="flex">
                    <input
                      type="text"
                      className="w-full px-4 py-2 text-gray-900 bg-white border-0 3/4 rounded-l-lg focus:ring-2 focus:ring-green-300 focus:outline-none placeholder-gray-500"
                      placeholder="Search for gas cylinders, accessories..."
                      value={searchKeyword}
                      onChange={handleSearchInputChange}
                      onFocus={() =>
                        searchKeyword.length > 2 && setShowSuggestions(true)
                      }
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-r-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </form>

                  {/* Search Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-2 z-50 max-h-60 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center transition-colors duration-150"
                          onClick={() => {
                            setSearchKeyword(suggestion);
                            setShowSuggestions(false);
                            navigate(
                              `/search?q=${encodeURIComponent(suggestion)}`
                            );
                          }}
                        >
                          <svg
                            className="w-4 h-4 text-gray-400 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <span className="text-gray-700">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                {/* City Selector */}
                <button
                  onClick={() => setShowCity(true)}
                  className="text-white px-2 py-2 rounded-md text-sm font-medium flex gap-4"
                >
                  Hyderabad <ChevronDown />
                </button>

                {/* Navigation Links */}

                <MultiLevelMenu />
                {/* <Link
                  to="/services"
                  className={`text-white px-2 py-2 rounded-md text-sm font-medium flex gap-5`}
                >
                  Services
                </Link> */}

                <Link
                  to="/faqs"
                  className={`text-white px-2 py-2 rounded-md text-sm font-medium flex gap-5`}
                >
                  FAQ's
                </Link>

                {/* Dashboard (Only for logged in users) */}
                {userLoggedIn != null && (
                  <Link
                    to="/dashboard"
                    className={`text-white px-2 py-2 rounded-md text-sm font-medium flex gap-5`}
                  >
                    Dashboard
                  </Link>
                )}

                {/* User Authentication */}
                {userLoggedIn == null ? (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-white px-2 py-2 rounded-md text-sm font-medium flex gap-5"
                  >
                    Login
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    {/* User Dropdown */}
                    <div className="relative" ref={userDropdownRef}>
                      <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="border border-white text-white hover:text-green-100 p-1 rounded-full hover:bg-green-700 transition-all duration-200"
                      >
                        <User />
                      </button>

                      {showUserDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 border border-gray-200">
                          <Link
                            to="/profile"
                            className="flex gap-2 items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <User size={18} />
                            My Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex gap-2 items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                          >
                            <LogOut size={18} />
                            Logout
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                      <button
                        onClick={toggleNotificationPanel}
                        className="text-white hover:text-green-100 p-2 rounded-full hover:bg-green-700 transition-all duration-200 relative"
                        aria-label="Notifications"
                      >
                        <Bell />
                        {unseenCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                            {unseenCount}
                          </span>
                        )}
                      </button>

                      {showNotifyPanel && (
                        <div ref={notifyPanelRef} className="absolute right-0 top-12 w-96 max-h-[80vh] overflow-y-auto bg-white rounded-md shadow-lg border border-gray-200 z-50">
                          <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {selectedNotificationId
                                ? "Notification Details"
                                : "Notifications"}
                            </h3>
                            <button
                              className="text-sm text-red-500 hover:text-red-700"
                              onClick={() => {
                                setShowNotifyPanel(false);
                                setSelectedNotificationId(null);
                              }}
                              aria-label="Close notifications"
                            >
                              Close
                            </button>
                          </div>

                          {/* ✅ MODIFIED: Notification Content Rendering Logic */}
                          <div className="divide-y divide-gray-200">
                            {selectedNotificationId ? (
                              // Detail View
                              <div className="p-4 ">
                                {selectedNotificationDetail ? (
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-800 text-lg">
                                      {selectedNotificationDetail.title}
                                    </h4>
                                    <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                                      {selectedNotificationDetail.subject}
                                    </div>
                                    {selectedNotificationDetail.datetime && (
                                      <p className="text-xs text-gray-500">
                                        {format(
                                          new Date(
                                            selectedNotificationDetail.datetime
                                          ),
                                          "dd MMM yyyy, hh:mm a"
                                        )}
                                      </p>
                                    )}
                                    <button
                                      onClick={handleBackToNotifications}
                                      className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                      ← Back to all notifications
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-600 space-y-2 py-4 text-center">
                                    <p>Notification not found.</p>
                                    <button
                                      onClick={handleBackToNotifications}
                                      className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                      ← Back to all notifications
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              // List View
                              <>
                                {isNotificationsLoading ? (
                                  <div className="p-4 text-sm text-gray-600 text-center">
                                    Loading notifications...
                                  </div>
                                ) : notifications.length > 0 ? (
                                  notifications.map((noti) => (
                                    <div
                                      key={noti.id}
                                      onClick={() =>
                                        handleNotificationClick(noti)
                                      } // Pass the whole notification object
                                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors
                                        ${
                                          noti.seen_status == 0
                                            ? "bg-green-50"
                                            : ""
                                        }
                                      `}
                                    >
                                      <div className="font-medium text-gray-800">
                                        {noti.title}
                                      </div>
                                      <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                                        {noti.subject}
                                      </div>
                                      <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">
                                          {format(
                                            new Date(noti.datetime),
                                            "dd MMM, hh:mm a"
                                          )}
                                        </span>
                                        {noti.is_unread && (
                                          <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="p-4 text-sm text-gray-600 text-center">
                                    No notifications available.
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cart */}
                    <Link
                      to="/cart"
                      className="text-white hover:text-green-100 p-2 rounded-full hover:bg-green-700 transition-all duration-200 relative"
                    >
                      <ShoppingCart />
                      {Number(cartData?.count) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {cartData?.count}
                        </span>
                      )}
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:text-green-100 p-2 rounded-md transition-colors duration-200  ease-in"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isMobileMenuOpen
                          ? "M6 18L18 6M6 6l12 12"
                          : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div
              className={`md:hidden overflow-hidden transform transition-all duration-500 ease-in-out ${
                isMobileMenuOpen
                  ? "max-h-[1000px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              } bg-green-700 border-t border-green-500`}
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                <Link
                  to="/products/All"
                  className="block text-white hover:text-green-100 hover:bg-green-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                {/* <Link
                  to="/services"
                  className="block text-white hover:text-green-100 hover:bg-green-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link> */}
                <Link
                  to="/faqs"
                  className="block text-white hover:text-green-100 hover:bg-green-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQ's
                </Link>

                {/* Mobile Cart Link */}
                <Link
                  to="/cart"
                  className="text-white gap-2 hover:text-green-100 hover:bg-green-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart />
                  Cart {Number(cartData?.count) > 0 && `(${cartData?.count})`}
                </Link>

                {userLoggedIn != null ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block text-white hover:text-green-100 hover:bg-green-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block text-white hover:text-green-100 hover:bg-green-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left text-white hover:text-green-100 hover:bg-green-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className=" text-white hover:text-green-100 hover:bg-green-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Search Bar */}
        {/* <div className="md:hidden bg-gray-50 px-4 py-3 border-t border-green-500">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="Search Gaswale..."
              value={searchKeyword}
              onChange={handleSearchInputChange}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-r-lg transition-colors duration-200 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div> */}
      </header>

      {/* Spacer div to prevent content from hiding under sticky header */}
      <div className="h-16"></div>

      {/* <Login isOpen={showLogin} setIsOpen={setShowLogin} /> */}
      <SelectCity isOpen={showCity} closeModel={() => setShowCity(false)} />
      {/* <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      ></CustomModal> */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="My Modal Title"
        showHeader={false}
        backdropClose={false}
      >
        <Login isOpen={isModalOpen} onSuccess={() => setIsModalOpen(false)} />
      </CustomModal>
    </>
  );
};

export default Header;
