import React from "react";
import { Star } from "lucide-react";

const FeedbackModal = ({
  isOpen,
  onClose,
  onSubmit,
  rating,
  setRating,
  fbtext,
  setFbtext,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md  rounded-lg p-5 w-[320px]">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Feedback</h2>
          <button className="text-lg font-bold" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`cursor-pointer ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
              fill={star <= rating ? "currentColor" : "none"}
              stroke="currentColor"
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea
          rows={3}
          placeholder="Tell us what you loved.."
          className="border w-full rounded p-2 mb-4"
          value={fbtext}
          onChange={(e) => setFbtext(e.target.value)}
        ></textarea>

        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default FeedbackModal;