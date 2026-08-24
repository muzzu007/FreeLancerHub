import { useState } from "react";
import { toast } from "react-hot-toast";
import { createReview } from "../../services/reviewService";
import { Star, Send, X } from "lucide-react";

function ReviewForm({ projectId, onReviewCreated, onCancel }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createReview({
        project: projectId,
        rating,
        comment,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Unable to submit review");
        return;
      }

      toast.success("Review submitted successfully!");
      setRating(5);
      setComment("");

      if (onReviewCreated) {
        onReviewCreated(data.review);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to reach server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;
              const isFilled = hoveredRating
                ? starValue <= hoveredRating
                : starValue <= rating;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredRating(starValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={
                      isFilled
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 hover:text-gray-400"
                    }
                  />
                </button>
              );
            })}
            <span className="ml-3 text-sm font-medium text-gray-600">
              {rating}/5
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Comment
          </label>
          <textarea
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#635bff]/30 focus:border-[#635bff] outline-none transition"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            minLength={10}
            maxLength={1000}
            rows={5}
            placeholder="Share your experience (minimum 10 characters)..."
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1.5">
            <span>{comment.length}/1000 characters</span>
            {comment.length > 0 && comment.length < 10 && (
              <span className="text-yellow-600">
                Need {10 - comment.length} more characters
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-[#635bff] to-[#00d4b2] hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {submitting ? "Submitting..." : "Submit Review"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <X size={18} />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;