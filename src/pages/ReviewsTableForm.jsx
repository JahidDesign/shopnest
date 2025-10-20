import React, { useState, useEffect } from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaStar } from "react-icons/fa";

const ReviewsTableForm = () => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    service: "",
    comment: "",
    rating: 0,
    social: { facebook: "", linkedin: "", twitter: "" },
    image: "",
  });
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.comment || !form.service || form.rating === 0) {
      alert("Please fill all required fields and rating");
      return;
    }

    try {
      if (isEditing) {
        // Update existing review
        const response = await fetch(`https://shopnest-serveres.onrender.com/users/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Failed to update review");

        const updatedReview = await response.json();
        setReviews(reviews.map((r) => (r.id === form.id ? updatedReview : r)));
        setIsEditing(false);
      } else {
        // Create new review
        const response = await fetch("https://shopnest-serveres.onrender.com/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Failed to submit review");

        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
      }

      setForm({
        id: null,
        name: "",
        service: "",
        comment: "",
        rating: 0,
        social: { facebook: "", linkedin: "", twitter: "" },
        image: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error submitting review");
    }
  };

  const handleEdit = (review) => {
    setForm(review);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const response = await fetch(`https://shopnest-serveres.onrender.com/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete review");
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting review");
    }
  };

  return (
    <div className="px-6 md:px-12 py-12 bg-[#FFDAB9] min-h-screen">
      {/* Form Section */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg mb-12 border-2 border-[#FF6600]">
        <h2 className="text-2xl font-bold mb-6 text-[#CC5500]">
          {isEditing ? "Edit Review" : "Submit Your Review"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          />

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

          <input
            type="text"
            name="image"
            placeholder="Profile Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full p-4 border-2 border-[#FF7F32] rounded-xl focus:border-[#FF6600] focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] text-white py-3 px-6 rounded-2xl font-semibold transition-all transform hover:scale-105"
          >
            {isEditing ? "Update Review" : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Reviews Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-2 border-[#FF6600] rounded-xl overflow-hidden">
          <thead className="bg-[#FF7F32] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Service</th>
              <th className="py-3 px-4 text-left">Rating</th>
              <th className="py-3 px-4 text-left">Comment</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="bg-[#FFDAB9] border-b border-[#FF6600] hover:bg-[#FF7F32]/30 transition">
                <td className="py-3 px-4 text-[#CC5500] font-semibold">{review.name}</td>
                <td className="py-3 px-4 text-[#FF7F32]">{review.service}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? "text-[#FF6600]" : "text-[#FF7F32]"}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-[#CC5500] italic">{review.comment}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="bg-[#FFA500] text-white py-1 px-3 rounded-lg hover:bg-[#FF7F32]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-[#FF6600] text-white py-1 px-3 rounded-lg hover:bg-[#CC5500]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsTableForm;
