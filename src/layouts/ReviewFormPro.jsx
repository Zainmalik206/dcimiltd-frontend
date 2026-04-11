import { useState } from "react";
import { toast } from "react-toastify";
import { reviewAPI } from "../api/reviewAPI";
import { Star } from "lucide-react";
import { successToast } from "../functions/toastify";

const ReviewFormPro = ({ productId, onReviewAdded }) => {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!rating || !comment.trim() || !address.trim()) {
      toast.error("All fields required");
      return;
    }
    setLoading(true);
    const res = await reviewAPI.add(productId, comment, address, rating);
    setLoading(false);
    if (res.ok) {
      successToast("Review submitted!");
      onReviewAdded();
      resetForm();
    } else {
      toast.error(res.error || "Login required");
    }
  };

  const resetForm = () => {
    setRating(0); setComment(""); setAddress(""); setStep(1);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-bold mb-4">Review this Product</h3>
      {step === 1 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">Overall Rating *</p>
          <div className="flex gap-3 mb-6">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => { setRating(n); setStep(2); }}
                className={`p-3 rounded-lg border-2 ${rating === n ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                <Star size={32} className={rating >= n ? "fill-blue-500 text-blue-500" : "text-gray-400"} />
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Your review..." rows={4} className="w-full p-3 border rounded-lg" />
          <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Your address" className="w-full p-3 border rounded-lg" />
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border rounded-full">Back</button>
            <button onClick={submit} disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-full disabled:opacity-50">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewFormPro;