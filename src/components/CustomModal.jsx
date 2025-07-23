// CustomModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const backdropVariants = {
  visible: { opacity: 1, transition: { duration: 0.2 } },
  hidden: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: "easeInOut" },
  },
  exit: {
    y: "-100vh",
    opacity: 0,
    transition: { duration: 1, ease: "easeInOut" },
  },
};

const CustomModal = ({
  isOpen,
  onClose,
  children,
  className = "",
  showHeader = true,
  backdropClose = true,
  title = "Custom Modal",
}) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center sm:items-start sm:pt-20  "
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={backdropClose ? onClose : undefined}
        >
          <motion.div
            className={`
              bg-white 
              rounded-t-lg sm:rounded-lg 
              shadow-xl 
              w-full 
              max-w-lg 
              sm:p-6 p-4 
              relative 
              mx-2 
              sm:mx-0 
              
              ${className}
            `}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {showHeader || (
              <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2 ">
                <X onClick={onClose} size={25} />
              </div>
            )}
            {showHeader && (
              <div className="flex justify-between items-center mb-4 border-b border-b-gray-400 pb-2">
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="text-gray-600 hover:text-gray-800 transition-colors">
                  <X onClick={onClose} size={25} />
                </div>
              </div>
            )}
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
