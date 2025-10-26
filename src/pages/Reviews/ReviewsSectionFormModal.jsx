// File: src/components/ReviewsSectionFormModal.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";

const ORANGE_PALETTE = {
  vivid: "#FF6600",     // CTA, icons
  bright: "#FFA500",    // accents
  tangerine: "#FF7F32", // hover, secondary
  peach: "#FFDAB9",     // backgrounds
  burnt: "#CC5500",     // headers
};

// Base URL for your users endpoint
const API_BASE = "https://shopnest-ecom.onrender.com/users";

const ReviewsSectionFormModal = ({ serviceId, onClose }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    name: "",
    service: "",
    comment: "",
    rating: 0,
    image: "",
    social: { facebook: "", linkedin: "", twitter: "" },
  });
  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);

  // Fetch existing reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(API_BASE);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["facebook", "linkedin", "twitter"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        social: { ...prev.social, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRating = (rate) => setForm((prev) => ({ ...prev, rating: rate }));

  const handleNextStep = (e) => {
    e.preventDefault();

    if (!user || !user.email) {
      Swal.fire({
        icon: "error",
        title: "Please log in first!",
        text: "You need to log in to submit a review.",
      });
      return;
    }

    if (!serviceId) {
      Swal.fire({
        icon: "warning",
        title: "Missing Service ID",
        text: "You can only review a valid service.",
      });
      return;
    }

    if (!form.name || !form.comment || !form.service || form.rating === 0) {
      Swal.fire({
        icon: "error",
        title: "Please fill all required fields",
      });
      return;
    }

    setPreview(form);
    setStep(2);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        email: user.email,
        serviceId,
      };

      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      const newReview = await response.json();
      setReviews([newReview, ...reviews]);

      Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your review has been submitted successfully.",
      });

      setForm({
        name: "",
        service: "",
        comment: "",
        rating: 0,
        image: "",
        social: { facebook: "", linkedin: "", twitter: "" },
      });
      setStep(1);
      setPreview(null);
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to submit review",
        text: "Please try again later.",
      });
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
          <h3 className="text-2xl font-bold mb-4" style={{ color: ORANGE_PALETTE.vivid }}>
            Login Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please log in to submit a review for this service.
          </p>
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl text-white"
            style={{ backgroundColor: ORANGE_PALETTE.vivid }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 relative"
        style={{ border: `2px solid ${ORANGE_PALETTE.peach}` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl"
          style={{ color: ORANGE_PALETTE.vivid }}
        >
          ×
        </button>

        {step === 1 && (
          <>
            <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: ORANGE_PALETTE.burnt }}>
              Submit Your Review
            </h3>
            <form onSubmit={handleNextStep} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-4 rounded-xl focus:outline-none border-2"
                style={{ borderColor: ORANGE_PALETTE.tangerine }}
              />
              <input
                type="text"
                name="service"
                placeholder="Service Name"
                value={form.service}
                onChange={handleChange}
                className="w-full p-4 rounded-xl focus:outline-none border-2"
                style={{ borderColor: ORANGE_PALETTE.tangerine }}
              />
              <textarea
                name="comment"
                placeholder="Your Comment"
                value={form.comment}
                onChange={handleChange}
                className="w-full p-4 rounded-xl focus:outline-none resize-none border-2"
                style={{ borderColor: ORANGE_PALETTE.tangerine }}
                rows={4}
              />
              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ color: ORANGE_PALETTE.burnt }}>Rating:</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className="cursor-pointer transition-transform duration-150 hover:scale-110"
                    onClick={() => handleRating(i + 1)}
                    style={{ color: i < form.rating ? ORANGE_PALETTE.vivid : ORANGE_PALETTE.peach }}
                  />
                ))}
              </div>

              {/* Social URLs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  name="facebook"
                  placeholder="Facebook URL"
                  value={form.social.facebook}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border-2"
                  style={{ borderColor: ORANGE_PALETTE.tangerine }}
                />
                <input
                  type="text"
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  value={form.social.linkedin}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border-2"
                  style={{ borderColor: ORANGE_PALETTE.tangerine }}
                />
                <input
                  type="text"
                  name="twitter"
                  placeholder="Twitter URL"
                  value={form.social.twitter}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border-2"
                  style={{ borderColor: ORANGE_PALETTE.tangerine }}
                />
              </div>

              <input
                type="text"
                name="image"
                placeholder="Profile Image URL"
                value={form.image}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border-2"
                style={{ borderColor: ORANGE_PALETTE.tangerine }}
              />

              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-semibold transition-all transform hover:scale-105 text-white"
                style={{
                  background: `linear-gradient(90deg, ${ORANGE_PALETTE.vivid}, ${ORANGE_PALETTE.tangerine}, ${ORANGE_PALETTE.bright})`,
                }}
              >
                Next
              </button>
            </form>
          </>
        )}

        {step === 2 && preview && (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6" style={{ color: ORANGE_PALETTE.burnt }}>
              Confirm Your Review
            </h3>
            <div
              className="p-6 rounded-xl mb-6 border-2"
              style={{ borderColor: ORANGE_PALETTE.vivid, backgroundColor: ORANGE_PALETTE.peach }}
            >
              <img
                src={preview.image || "https://i.pravatar.cc/100"}
                alt={preview.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 border-2"
                style={{ borderColor: ORANGE_PALETTE.vivid }}
              />
              <h4 className="font-bold" style={{ color: ORANGE_PALETTE.burnt }}>{preview.name}</h4>
              <p className="mb-2" style={{ color: ORANGE_PALETTE.tangerine }}>{preview.service}</p>
              <div className="flex justify-center items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    style={{ color: i < preview.rating ? ORANGE_PALETTE.vivid : ORANGE_PALETTE.peach }}
                  />
                ))}
              </div>
              <p className="italic" style={{ color: ORANGE_PALETTE.burnt }}>"{preview.comment}"</p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStep(1)}
                className="py-2 px-6 rounded-xl font-semibold"
                style={{ backgroundColor: ORANGE_PALETTE.peach, color: ORANGE_PALETTE.burnt }}
              >
                Edit
              </button>
              <button
                onClick={handleSubmit}
                className="py-2 px-6 rounded-xl font-semibold text-white"
                style={{ backgroundColor: ORANGE_PALETTE.vivid }}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSectionFormModal;
