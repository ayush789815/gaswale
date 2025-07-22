import React, { useState } from "react";
import { Link } from "react-router-dom";
import insta from "../assets/images/Insta.png";
import FB from "../assets/images/fb.png";
import linkedin from "../assets/images/linkedin.png";
import youtube from "../assets/images/youtube.png";
import whatsapp from "../assets/images/whatsapp.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <footer className="bg-white mt-auto w-full">
        <div className="container mx-auto px-3 sm:px-6">
          {/* Main Footer Content */}
          <div className="py-4 md:py-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-6 lg:space-y-0">
              {/* Navigation Links */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 md:gap-8">
                <Link
                  to="/about"
                  className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 text-base sm:text-base py-1"
                >
                  About Us
                </Link>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 text-base sm:text-base py-1"
                >
                  Contact Us
                </button>
                <Link
                  to="/policies"
                  className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 text-base sm:text-base py-1"
                >
                  Policies
                </Link>
              </div>

              {/* Social Media */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
                <span className="text-gray-700 font-medium text-lg sm:text-base">Follow Us on:</span>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Facebook"
                  >
                    <img src={FB} className="h-8 w-8 sm:h-6 sm:w-6 object-contain rounded-sm" alt="Facebook" />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Instagram"
                  >
                    <img src={insta} className="h-8 w-8 sm:h-6 sm:w-6 object-contain rounded-sm" alt="Instagram" />
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="YouTube"
                  >
                    <img src={youtube} className="h-8 w-8 sm:h-6 sm:w-6 object-contain rounded-sm" alt="YouTube" />
                  </a>
                  <a 
                    href="https://wa.me/your-number" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="WhatsApp"
                  >
                    <img src={whatsapp} className="h-8 w-8 sm:h-6 sm:w-6 object-contain rounded-sm" alt="WhatsApp" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="LinkedIn"
                  >
                    <img src={linkedin} className="h-8 w-8 sm:h-6 sm:w-6 object-contain rounded-sm" alt="LinkedIn" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-[#dc3545] py-3 sm:py-4">
            <div className="text-center lg:text-right">
              <p className="text-[#212529] text-xs sm:text-sm">
                Gaswale © {currentYear}, ALL RIGHTS RESERVED
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-2 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-[95%] sm:max-w-md md:max-w-xl p-2 sm:p-6 relative shadow-2xl my-4">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-lg sm:text-xl font-medium text-gray-800">Contact Us</h1>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 text-2xl hover:text-red-500 w-10 h-10 flex items-center justify-center"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-bold text-center text-black mb-1">How Can We Help?</h2>
            <p className="text-center text-xs sm:text-sm text-gray-600 mb-3">Send us a message!</p>

            {/* Form */}
            <form className="space-y-3 sm:space-y-4">
              {[
                { label: "Name", type: "text", placeholder: "Your name" },
                { label: "Email Id", type: "email", placeholder: "Your email address" },
                { label: "Contact number", type: "tel", placeholder: "Your phone number" },
                { label: "Subject", type: "text", placeholder: "Message subject" },
              ].map(({ label, type, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-green-500 focus:border-green-500 transition-colors"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  placeholder="Type your message here..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-green-500 focus:border-green-500 transition-colors"
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="text-right pt-2">
                <button
                  type="submit"
                  className="bg-violet-600 text-white px-5 sm:px-6 py-2.5 rounded text-sm sm:text-base hover:bg-violet-700 transition-colors focus:ring-2 focus:ring-violet-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;