// src/layouts/ReviewsList.jsx
import { Star } from "lucide-react";
import { format } from "date-fns";

const ReviewsList = ({ reviews = [] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const user = review.user || {};
        const profilePic = user.profile_picture || `https://ui-avatars.com/api/?name=${user.first_name || "User"}&background=fb923c&color=fff`;

        return (
          <div key={review._id} className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-start gap-4">
              {/* Profile Picture */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-200">
                <img
                  src={profilePic}
                  alt={user.first_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user.first_name || "U"}&background=fb923c&color=fff`;
                  }}
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {user.first_name} {user.last_name}
                  </h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-700">{review.comment}</p>

                <p className="text-xs text-gray-500 mt-2">
                  {format(new Date(review.createdAt), "dd MMM yyyy")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewsList;