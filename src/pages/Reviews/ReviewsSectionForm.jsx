import React, { useState, useEffect } from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaStar } from "react-icons/fa";

const ReviewsSectionForm = () => {
  const [reviews, setReviews] = useState([]);
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("https://shopnest-serveres.onrender.com/users");
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
    if (!form.name || !form.comment || !form.service || form.rating === 0) {
      alert("Please fill all required fields and rating");
      return;
    }
    setPreview(form);
    setStep(2);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("https://shopnest-serveres.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      const newReview = await response.json();
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
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#FFDAB9] via-[#FF7F32] to-[#FF6600] text-white py-32 px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Trusted Insurance Services
        </h1>
        <p className="text-lg md:text-2xl max-w-3xl mx-auto">
          Real feedback from clients who trust our services. Read their reviews or submit your own!
        </p>
      </section>

      {/* Review Form Section */}
      <section className="py-20 px-6 md:px-12 bg-[#FFDAB9]">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg mb-12 border-2 border-[#FF6600]">
          {step === 1 && (
            <>
              <h3 className="text-2xl font-bold mb-6 text-[#CC5500]">Submit Your Review</h3>
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    name="service"
                    placeholder="Service Name"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                    required
                  />
                </div>

                <textarea
                  name="comment"
                  placeholder="Your Comment"
                  value={form.comment}
                  onChange={handleChange}
                  className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none resize-none"
                  rows={4}
                  required
                ></textarea>

                <div className="flex items-center gap-2">
                  <span className="text-[#CC5500]">Rating:</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`cursor-pointer ${i < form.rating ? "text-[#FF6600]" : "text-[#FF7F32]"}`}
                      onClick={() => handleRating(i + 1)}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="facebook"
                    placeholder="Facebook URL"
                    value={form.social.facebook}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                  />
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn URL"
                    value={form.social.linkedin}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                  />
                  <input
                    type="text"
                    name="twitter"
                    placeholder="Twitter URL"
                    value={form.social.twitter}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[#CC5500]">Profile Image URL:</label>
                  <input
                    type="text"
                    name="image"
                    placeholder="Enter image URL"
                    value={form.image}
                    onChange={handleChange}
                    className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] text-white py-3 px-6 rounded-2xl font-semibold transition-all transform hover:scale-105"
                >
                  Preview
                </button>
              </form>
            </>
          )}

          {step === 2 && preview && (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-[#CC5500]">Confirm Your Review</h3>
              <div className="bg-[#FF7F32]/20 p-6 rounded-xl mb-6 border-2 border-[#FF6600]">
                <img
                  src={preview.image || "https://i.pravatar.cc/150?img=50"}
                  alt={preview.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-[#FF6600]"
                />
                <h4 className="font-bold text-[#CC5500]">{preview.name}</h4>
                <p className="text-[#FF7F32] mb-2">{preview.service}</p>
                <div className="flex justify-center items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className={i < preview.rating ? "text-[#FF6600]" : "text-[#FF7F32]"} />
                  ))}
                </div>
                <p className="text-[#CC5500] italic">"{preview.comment}"</p>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="bg-[#FFDAB9] text-[#CC5500] py-2 px-6 rounded-xl hover:bg-[#FF7F32]"
                >
                  Edit
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-[#FF6600] text-white py-2 px-6 rounded-xl hover:bg-[#FF7F32]"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-[#FFDAB9]/80 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 border-2 border-[#FF6600]"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.image || `https://i.pravatar.cc/150?img=${index + 10}`}
                  alt={review.name || "User"}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#FF6600]"
                />
                <div>
                  <h3 className="font-bold text-[#CC5500]">{review.name || "Anonymous"}</h3>
                  <p className="text-sm text-[#FF7F32]">{review.service || "Insurance Service"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    className={starIndex < (review.rating || 0) ? "text-[#FF6600]" : "text-[#FF7F32]"}
                  />
                ))}
              </div>

              <p className="text-[#CC5500] italic">"{review.comment || "No comment provided."}"</p>

              <div className="flex gap-3 mt-4 text-[#FF7F32]">
                {review.social?.facebook && <a href={review.social.facebook}><FaFacebookF /></a>}
                {review.social?.linkedin && <a href={review.social.linkedin}><FaLinkedinIn /></a>}
                {review.social?.twitter && <a href={review.social.twitter}><FaTwitter /></a>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReviewsSectionForm;
