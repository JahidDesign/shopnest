import React, { useState, useEffect } from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaStar } from "react-icons/fa";
import Swal from "sweetalert2";

const ReviewsSectionForm = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    service: "",
    comment: "",
    rating: 0,
    social: { facebook: "", linkedin: "", twitter: "" },
    image: "",
  });

  const [step, setStep] = useState(1);
  const [preview, setPreview] = useState(null);

  // ✅ Fetch all reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("https://shopnest-ecom.onrender.com/users");
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // ✅ Handle input changes
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

  // ✅ Handle star rating
  const handleRating = (rating) =>
    setForm((prev) => ({ ...prev, rating }));

  // ✅ Next step (preview)
  const handleNextStep = (e) => {
    e.preventDefault();
    if (!form.name || !form.comment || !form.service || form.rating === 0) {
      Swal.fire("Warning", "Please fill in all fields and select a rating.", "warning");
      return;
    }
    setPreview(form);
    setStep(2);
  };

  // ✅ Submit review
  const handleSubmit = async () => {
    try {
      const res = await fetch("https://shopnest-ecom.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit review");
      const newReview = await res.json();

      Swal.fire("Success", "Your review has been submitted!", "success");
      setReviews([newReview, ...reviews]);
      setForm({
        name: "",
        service: "",
        comment: "",
        rating: 0,
        social: { facebook: "", linkedin: "", twitter: "" },
        image: "",
      });
      setStep(1);
      setPreview(null);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Error", "Submission failed. Try again later.", "error");
    }
  };

  return (
    <div className="font-sans">
      {/* ✅ Hero Section */}
      <section className="relative bg-gradient-to-r from-[#FFDAB9] via-[#FF7F32] to-[#FF6600] text-white py-28 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Shopnest Reviews
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl mx-auto opacity-90">
          Hear from customers who trust Shopnest — share your experience today!
        </p>
      </section>

      {/* ✅ Review Form Section */}
      <section className="py-20 px-6 md:px-12 bg-[#FFDAB9] min-h-screen">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl mb-16 border-2 border-[#FF6600]">
          {step === 1 ? (
            <>
              <h3 className="text-2xl font-bold mb-6 text-[#CC5500]">
                Write a Review
              </h3>
              <form onSubmit={handleNextStep} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    placeholder="Product / Service"
                    className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                    required
                  />
                </div>

                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Write your review..."
                  className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none resize-none"
                  rows={4}
                  required
                ></textarea>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-[#CC5500] font-semibold">Rating:</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`cursor-pointer text-2xl ${
                        i < form.rating ? "text-[#FF6600]" : "text-[#FFB380]"
                      }`}
                      onClick={() => handleRating(i + 1)}
                    />
                  ))}
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["facebook", "linkedin", "twitter"].map((platform) => (
                    <input
                      key={platform}
                      type="text"
                      name={platform}
                      value={form.social[platform]}
                      onChange={handleChange}
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                      className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                    />
                  ))}
                </div>

                {/* Image */}
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Profile Image URL"
                  className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] text-white py-3 px-6 rounded-2xl font-semibold transition-all transform hover:scale-105"
                >
                  Preview
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-[#CC5500]">
                Confirm Your Review
              </h3>
              <div className="bg-[#FF7F32]/20 p-6 rounded-xl mb-6 border-2 border-[#FF6600]">
                <img
                  src={preview.image || "https://i.pravatar.cc/150?img=50"}
                  alt={preview.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-[#FF6600] object-cover"
                />
                <h4 className="font-bold text-[#CC5500] text-lg">
                  {preview.name}
                </h4>
                <p className="text-[#FF7F32]">{preview.service}</p>
                <div className="flex justify-center gap-1 my-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < preview.rating ? "text-[#FF6600]" : "text-[#FFB380]"}
                    />
                  ))}
                </div>
                <p className="text-[#CC5500] italic">"{preview.comment}"</p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-[#FFDAB9] text-[#CC5500] py-2 px-6 rounded-xl hover:bg-[#FF7F32]/30 transition"
                >
                  Edit
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#FF6600] text-white py-2 px-6 rounded-xl hover:bg-[#FF7F32] transition"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Existing Reviews */}
        {loading ? (
          <p className="text-center text-[#CC5500] text-lg">Loading reviews...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-[#FFDAB9]/80 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 border-2 border-[#FF6600]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={r.image || `https://i.pravatar.cc/150?img=${i + 20}`}
                    alt={r.name}
                    className="w-12 h-12 rounded-full border-2 border-[#FF6600] object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-[#CC5500]">{r.name}</h3>
                    <p className="text-sm text-[#FF7F32]">{r.service}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      className={
                        starIndex < (r.rating || 0)
                          ? "text-[#FF6600]"
                          : "text-[#FFB380]"
                      }
                    />
                  ))}
                </div>

                <p className="text-[#CC5500] italic">
                  "{r.comment || "No comment provided."}"
                </p>

                <div className="flex gap-3 mt-4 text-[#FF7F32] text-lg">
                  {r.social?.facebook && (
                    <a href={r.social.facebook} target="_blank" rel="noreferrer">
                      <FaFacebookF />
                    </a>
                  )}
                  {r.social?.linkedin && (
                    <a href={r.social.linkedin} target="_blank" rel="noreferrer">
                      <FaLinkedinIn />
                    </a>
                  )}
                  {r.social?.twitter && (
                    <a href={r.social.twitter} target="_blank" rel="noreferrer">
                      <FaTwitter />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReviewsSectionForm;
