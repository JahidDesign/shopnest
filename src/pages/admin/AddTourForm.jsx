import React, { useState } from "react";
import Swal from "sweetalert2";

const AddTourForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    categories: "",
    prices: "",
    images: [""],
    discount: "",
    discountEnd: "",
  });

  // Add new image input field
  const handleAddImage = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  // Update image value by index
  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  // Update text/number inputs
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.prices) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in Title, Description, and Price.",
      });
      return;
    }

    try {
      const res = await fetch("https://shopnest-ecom.onrender.com/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          categories: formData.categories
            ? formData.categories.split(",").map((c) => c.trim())
            : [],
          image: formData.images.filter(Boolean), // Only non-empty URLs
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Tour Added Successfully!",
          text: "Your new tour has been saved.",
          timer: 2000,
          showConfirmButton: false,
        });

        setFormData({
          title: "",
          description: "",
          tag: "",
          categories: "",
          prices: "",
          images: [""],
          discount: "",
          discountEnd: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Failed to add tour.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Could not connect to server. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 my-10 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🏝️ Add New Tour
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-semibold text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter tour title"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter tour description"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            rows="3"
          />
        </div>

        {/* Tag */}
        <div>
          <label className="block font-semibold text-gray-700">Tag</label>
          <input
            type="text"
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            placeholder="e.g. Adventure, Relax, Luxury"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block font-semibold text-gray-700">
            Categories
          </label>
          <input
            type="text"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            placeholder="Comma separated (e.g. Beach, Mountain, Forest)"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Prices */}
        <div>
          <label className="block font-semibold text-gray-700">Price ($)</label>
          <input
            type="number"
            name="prices"
            value={formData.prices}
            onChange={handleChange}
            placeholder="Enter tour price"
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Discount Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Enter discount (optional)"
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700">
              Discount End Date
            </label>
            <input
              type="date"
              name="discountEnd"
              value={formData.discountEnd}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Multiple Image URLs with Preview */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Image URLs
          </label>
          {formData.images.map((img, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-4 items-center mb-3"
            >
              <input
                type="text"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`Image URL ${index + 1}`}
                className="flex-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {/* Live Preview */}
              {img && (
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-20 object-cover rounded-md border border-gray-200 shadow-sm"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddImage}
            className="mt-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm rounded-md transition-all"
          >
            + Add Another Image
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-all"
        >
          Add Tour
        </button>
      </form>
    </div>
  );
};

export default AddTourForm;
