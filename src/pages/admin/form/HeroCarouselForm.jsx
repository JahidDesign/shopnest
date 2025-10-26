// src/components/HeroCarouselForm.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";

const colorOptions = [
  { name: "Vivid Orange", hex: "#FF6600" },
  { name: "Bright Orange", hex: "#FFA500" },
  { name: "Deep Tangerine", hex: "#FF7F32" },
  { name: "Soft Peach", hex: "#FFDAB9" },
  { name: "Burnt Orange", hex: "#CC5500" },
];

const HeroCarouselForm = ({ onAddSlide }) => {
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    buttonText: "",
    colorHex: colorOptions[0].hex,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------- Handle Input Change ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- Handle Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { image, title, description } = formData;

    if (!image || !title || !description) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill all required fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://shopnest-ecom.onrender.com/sectionhero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add slide");
      const savedSlide = await res.json();

      Swal.fire({
        icon: "success",
        title: "Slide Added!",
        text: `${title} has been added successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Pass to parent if needed
      onAddSlide?.(savedSlide);

      // Reset form
      setFormData({
        image: "",
        title: "",
        description: "",
        buttonText: "",
        colorHex: colorOptions[0].hex,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add slide. Check your server connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- Render Form ----------------
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🖼️ Add Hero Carousel Slide
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image URL */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 w-full h-48 object-cover rounded-lg border border-gray-300"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter slide title"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short description"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            rows={3}
            required
          />
        </div>

        {/* Button Text */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Button Text
          </label>
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            placeholder="e.g. Shop Now"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Color Shade */}
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            Color Shade
          </label>
          <div className="flex items-center gap-3">
            <select
              name="colorHex"
              value={formData.colorHex}
              onChange={handleChange}
              className="flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            >
              {colorOptions.map((color) => (
                <option key={color.hex} value={color.hex}>
                  {color.name} ({color.hex})
                </option>
              ))}
            </select>
            <div
              className="w-8 h-8 rounded-lg border"
              style={{ backgroundColor: formData.colorHex }}
            ></div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 font-semibold text-white rounded-lg transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FF6600] hover:bg-[#e65c00]"
          }`}
        >
          {isSubmitting ? "Adding..." : "Add Slide"}
        </button>
      </form>
    </div>
  );
};

export default HeroCarouselForm;
