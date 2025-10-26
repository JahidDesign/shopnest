import React, { useState } from "react";
import Swal from "sweetalert2";

const API_BASE = "https://shopnest-ecom.onrender.com"; // ✅ Base URL variable

const SunglassForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    category: "",
    subcategory: "",
    price: "",
    hasDiscount: false,
    discountPrice: "",
    discountStart: "",
    discountEnd: "",
    stock: "",
    status: "published",
    featured: false,
    weight: "",
    dimensions: "",
    description: "",
    images: [],
    tags: [],
    variants: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    relatedProducts: [],
    rating: 0,
  });

  const [imageInput, setImageInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [variantInput, setVariantInput] = useState({ color: "", size: "", price: "", stock: "" });
  const [hoverRating, setHoverRating] = useState(0);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Images
  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, imageInput] }));
    setImageInput("");
  };
  const handleRemoveImage = (idx) =>
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  // Tags
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput("");
  };
  const handleRemoveTag = (idx) =>
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));

  // Variants
  const handleAddVariant = () => {
    if (!variantInput.color || !variantInput.size || !variantInput.price) {
      Swal.fire("Warning", "Fill all variant fields!", "warning");
      return;
    }
    setFormData((prev) => ({ ...prev, variants: [...prev.variants, { ...variantInput }] }));
    setVariantInput({ color: "", size: "", price: "", stock: "" });
  };
  const handleRemoveVariant = (idx) =>
    setFormData((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || formData.images.length === 0) {
      Swal.fire("Missing Fields", "Please fill required fields and add at least one image.", "warning");
      return;
    }

    if (formData.hasDiscount && (!formData.discountPrice || parseFloat(formData.discountPrice) >= parseFloat(formData.price))) {
      Swal.fire("Invalid Discount", "Discount price must be less than regular price.", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/sunglasses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Product added successfully!", "success");

        // Reset form
        setFormData({
          name: "", sku: "", brand: "", category: "", subcategory: "", price: "",
          hasDiscount: false, discountPrice: "", discountStart: "", discountEnd: "",
          stock: "", status: "published", featured: false, weight: "", dimensions: "",
          description: "", images: [], tags: [], variants: [], metaTitle: "",
          metaDescription: "", metaKeywords: "", relatedProducts: [], rating: 0,
        });
        setImageInput("");
        setTagInput("");
        setVariantInput({ color: "", size: "", price: "", stock: "" });
        setHoverRating(0);
      } else {
        Swal.fire("Error", data.error || "Failed to add product", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error. Please try again.", "error");
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-white shadow-lg p-6 rounded-lg">
      <div className="text-2xl font-bold text-orange-600 mb-6 text-center">
        Sunglasses New Product
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* 🟠 Example Input Fields */}
        <div>
          <label className="block font-semibold text-gray-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 mt-1"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 mt-1"
            placeholder="e.g. Men’s Sunglasses"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 mt-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="hasDiscount"
            checked={formData.hasDiscount}
            onChange={handleChange}
          />
          <label className="font-semibold text-gray-700">Has Discount?</label>
        </div>

        {formData.hasDiscount && (
          <div>
            <label className="block font-semibold text-gray-700">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="col-span-2 text-center mt-6">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default SunglassForm;
