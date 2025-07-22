import { useRef, useState } from "react";
import { faqs } from "../constants/data";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const contentRefs = useRef([]);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h2>

      {faqs.map((faq, index) => (
        <div key={index} className="mb-4 border-b border-gray-200">
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center text-left text-base sm:text-lg font-semibold py-3 sm:py-4 focus:outline-none"
          >
            <span className="text-gray-800">{faq.question}</span>
            <span className="text-xl text-gray-600">
              {activeIndex === index ? "-" : "+"}
            </span>
          </button>

          <div
            ref={(el) => (contentRefs.current[index] = el)}
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight:
                activeIndex === index
                  ? contentRefs.current[index]?.scrollHeight + "px"
                  : "0px",
            }}
          >
            <div className="text-gray-600 text-sm sm:text-base pb-3 sm:pb-4 px-1 sm:px-2 whitespace-pre-line">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
