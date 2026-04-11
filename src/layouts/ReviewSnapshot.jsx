// src/layouts/ReviewSnapshot.jsx
import { Star } from "lucide-react";

const ReviewSnapshot = ({ ratingDist, totalReviews, avgRating }) => {
  const ratings = [5, 4, 3, 2, 1];
  const maxCount = Math.max(...Object.values(ratingDist || {}), 1);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Rating Snapshot</h3>
      <p className="text-sm text-gray-600 mb-4">Select a row below to filter reviews.</p>

      <div className="space-y-2">
        {ratings.map((star) => {
          const count = ratingDist?.[star] || 0;
          const width = (count / maxCount) * 100;

          return (
            <div
              key={star}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
              <span className="w-12 text-sm font-medium">{star} stars</span>
              <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                <div
                  className="bg-blue-400 h-full transition-all"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="w-12 text-sm text-gray-600 text-right">{count}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={i < Math.round(avgRating) ? "fill-blue-400 text-blue-400" : "text-gray-300"}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600">{totalReviews} Reviews</p>
      </div>
    </div>
  );
};

export default ReviewSnapshot;