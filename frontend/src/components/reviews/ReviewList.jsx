import ReviewCard from "./ReviewCard";
import { Star, Loader2 } from "lucide-react";

function ReviewList({ reviews, loading = false }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-[#635bff]" />
        <span className="ml-3 text-gray-500">Loading reviews...</span>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
        <Star className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-500">No reviews found.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Reviews ({reviews.length})
      </h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
    </div>
  );
}

export default ReviewList;