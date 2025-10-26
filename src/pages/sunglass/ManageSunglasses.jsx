// src/pages/ManageSunglasses.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API_BASE = "https://shopnest-ecom.onrender.com"; // ✅ Common base URL

const ManageSunglasses = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    sku: "",
    brand: "",
    category: "Sunglasses",
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
  const [variantInput, setVariantInput] = useState({
    color: "",
    size: "",
    price: "",
    stock: "",
  });
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch sunglasses
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/sunglasses`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Image management
  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInput],
    }));
    setImageInput("");
  };

  const handleRemoveImage = (idx) =>
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));

  // Tags
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput("");
  };
  const handleRemoveTag = (idx) =>
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== idx),
    }));

  // Variants
  const handleAddVariant = () => {
    if (!variantInput.color || !variantInput.size || !variantInput.price) {
      Swal.fire("Warning", "Fill all variant fields!", "warning");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...variantInput }],
    }));
    setVariantInput({ color: "", size: "", price: "", stock: "" });
  };
  const handleRemoveVariant = (idx) =>
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== idx),
    }));

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || formData.images.length === 0) {
      Swal.fire("Missing Fields", "Please fill all required fields.", "warning");
      return;
    }

    try {
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id
        ? `${API_BASE}/sunglasses/${formData.id}`
        : `${API_BASE}/sunglasses`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", formData.id ? "Product Updated!" : "Product Added!", "success");
        fetchProducts();
        resetForm();
      } else {
        Swal.fire("Error", data.error || "Failed to save product", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error", "error");
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_BASE}/sunglasses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
        Swal.fire("Deleted!", "Product removed successfully.", "success");
      } else {
        Swal.fire("Error", "Failed to delete product", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network issue", "error");
      console.error(err);
    }
  };

  // Edit
  const handleEdit = (p) => {
    setFormData({ ...p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      sku: "",
      brand: "",
      category: "Sunglasses",
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
    setImageInput("");
    setTagInput("");
    setVariantInput({ color: "", size: "", price: "", stock: "" });
    setHoverRating(0);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        Manage Sunglasses
      </h1>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          type="text"
          name="name"
          placeholder="Product Name *"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (৳) *"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
          className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-orange-500 outline-none"
        />

        {/* Images */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2 text-gray-700">Images *</h4>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Image URL"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              className="border p-2 rounded flex-1 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formData.images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="h-32 w-full object-cover rounded border" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2 text-gray-700">Tags</h4>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add tag (e.g. polarized, UV400)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="border p-2 rounded flex-1 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((t, i) => (
              <div key={i} className="bg-orange-100 px-3 py-1 rounded flex items-center gap-2">
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(i)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2 text-gray-700">Rating</h4>
          <div className="flex items-center gap-1 text-xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`transition text-2xl ${
                  star <= (hoverRating || formData.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{formData.rating} / 5</span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="md:col-span-2 py-3 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
        >
          {formData.id ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Display Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Sunglasses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p._id} className="border rounded-lg shadow p-4 bg-white">
              <img
                src={p.images?.[0]}
                alt={p.name}
                className="h-40 w-full object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-600">৳{p.price}</p>
              <p className="text-sm text-yellow-500">⭐ {p.rating || 0}/5</p>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSunglasses;
