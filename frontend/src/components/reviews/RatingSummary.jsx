import { Star } from "lucide-react";

function RatingSummary({ averageRating, totalReviews }) {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-teal-50 rounded-xl p-6 border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Rating Summary</h3>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className={
                  i < Math.round(averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-gray-800">
            {averageRating}
            <span className="text-sm font-normal text-gray-500">/5</span>
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{totalReviews}</span> review{totalReviews !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

export default RatingSummary;