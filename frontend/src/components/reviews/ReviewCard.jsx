import { Star, User, Briefcase } from "lucide-react";

function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#635bff] to-[#00d4b2] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {review.reviewer?.name?.charAt(0) || "?"}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-800 flex items-center gap-1">
                <User size={14} className="text-gray-400" />
                {review.reviewer?.name || "Unknown"}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
          </div>

          <p className="text-gray-700 mt-2">{review.comment}</p>

          {review.project?.title && (
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <Briefcase size={14} className="text-gray-400" />
              Project: {review.project.title}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;