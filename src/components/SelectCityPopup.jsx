import { ArrowRight, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import hyd from "../assets/images/hyderabad.png";
import bangalore from "../assets/images/bangalore.png";
import chennai from "../assets/images/chennai.png";

export const SelectCity = ({ closeModel, isOpen }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Custom CSS for animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideDown {
        from { 
          top: 0px; 
          opacity: 0;
          transform: translateX(-50%) translateY(-100%);
        }
        to { 
          top: 15%; 
          opacity: 1;
          transform: translateX(-50%) translateY(-50%);
        }
      }
      
      @keyframes slideUp {
        from { 
          top: 15%; 
          opacity: 1;
          transform: translateX(-50%) translateY(-50%);
        }
        to { 
          top: 0px; 
          opacity: 0;
          transform: translateX(-50%) translateY(-100%);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      .animate-slide-down {
        animation: slideDown 0.6s ease-out forwards;
      }
      
      .animate-slide-up {
        animation: slideUp 0.6s ease-out forwards;
      }
      
      .animate-fade-in {
        animation: fadeIn 0.1s ease-out forwards;
      }
      
      .animate-fade-out {
        animation: fadeOut 0.2s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Handle opening animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
      document.body.style.overflowY = "hidden";
    }
  }, [isOpen]);

  // Handle closing animation
  const handleClose = () => {
    setIsAnimating(false);

    // Wait for animation to complete before unmounting
    setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflowY = "scroll";
      closeModel();
    }, 800); // Match animation duration
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Don't render if not open and not animating
  if (!isOpen && !shouldRender) {
    return null;
  }

  return (
    <div className="">
      {/* Wrapper - Backdrop */}
      <div
        className={`fixed left-0 bottom-0 right-0 top-0 flex h-screen w-screen bg-gray-400/20 z-50 ${
          isAnimating ? "" : "animate-fade-out"
        }`}
        onClick={handleBackdropClick}
      ></div>

      {/* Log Content - Main Modal */}
      <div
        className={`fixed max-w-[450px] w-full top-[15%] left-1/2 bg-white rounded-lg flex flex-col justify-start z-50  p-2 shadow-2xl ${
          isAnimating ? "animate-slide-down" : "animate-slide-up"
        }`}
      >
        {/* Log Content Head - Header */}
        <div className="pl-4 text-[21px] text-gray-800 font-medium">
          Select Your location
        </div>

        <div className="flex gap-5 mx-auto py-5">
          <div
            className="block justify-center items-center cursor-pointer"
            // onClick={() => closeModel()}
            onClick={() => handleClose()}
          >
            <img
              src={hyd}
              className="h-10 w-10 object-contain mx-auto"
              alt="Hyderabad"
            />
            <p className="text-center text-xs">Hyderabad</p>
          </div>
          <div className="block justify-center items-center opacity-40">
            <img
              src={bangalore}
              className="h-10 w-10 object-contain mx-auto"
              alt="Hyderabad"
            />
            <p className="text-center text-xs">Hyderabad</p>
            <p className="text-center text-xs">(Comming soon)</p>
          </div>
          <div className="block justify-center items-center opacity-40">
            <img
              src={chennai}
              className="h-10 w-10 object-contain mx-auto"
              alt="Hyderabad"
            />
            <p className="text-center text-xs">Hyderabad</p>
            <p className="text-center text-xs">(Comming soon)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
