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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { image, title, description } = formData;

    if (!image || !title || !description) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all required fields!",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("https://shopnest-serveres.onrender.com/heroCarousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add slide");

      const savedSlide = await res.json();

      Swal.fire({
        icon: "success",
        title: "Slide Added!",
        text: `${title} has been added to the carousel.`,
        timer: 2000,
        showConfirmButton: false,
      });

      onAddSlide?.(savedSlide);

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
        title: "Failed",
        text: "Could not add slide. Please check backend and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Hero Slide</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image URL */}
        <div>
          <label className="block font-semibold mb-1">Image URL *</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full border px-3 py-2 rounded"
            required
          />
          {/* Live preview */}
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-2 w-full h-48 object-cover rounded border"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Slide Title"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Slide description"
            className="w-full border px-3 py-2 rounded"
            rows={3}
            required
          />
        </div>

        {/* Button Text */}
        <div>
          <label className="block font-semibold mb-1">Button Text</label>
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            placeholder="Shop Now"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Color Shade */}
        <div>
          <label className="block font-semibold mb-1">Color Shade</label>
          <div className="flex items-center gap-2">
            <select
              name="colorHex"
              value={formData.colorHex}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              {colorOptions.map((color) => (
                <option key={color.hex} value={color.hex}>
                  {color.name} ({color.hex})
                </option>
              ))}
            </select>
            <div
              className="w-8 h-8 rounded border"
              style={{ backgroundColor: formData.colorHex }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white font-semibold rounded transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#FF6600] hover:bg-orange-600"
          }`}
        >
          {isSubmitting ? "Adding..." : "Add Slide"}
        </button>
      </form>
    </div>
  );
};

export default HeroCarouselForm;
