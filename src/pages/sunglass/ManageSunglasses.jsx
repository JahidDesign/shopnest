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

  // Fetch products
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.category || !formData.price || formData.images.length === 0) {
      Swal.fire("Missing Fields", "Please fill required fields and add at least one image.", "warning");
      return;
    }
    if (formData.hasDiscount && (!formData.discountPrice || parseFloat(formData.discountPrice) >= parseFloat(formData.price))) {
      Swal.fire("Invalid Discount", "Discount price must be less than regular price.", "warning");
      return;
    }

    try {
      let res;
      if (formData.id) {
        // Edit
        res = await fetch(`${API_BASE}/sunglasses/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new
        res = await fetch(`${API_BASE}/sunglasses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", formData.id ? "Product updated!" : "Product added!", "success");
        if (formData.id) {
          setProducts(products.map((p) => (p.id === data.id ? data : p)));
        } else {
          setProducts([data, ...products]);
        }

        // Reset form
        setFormData({
          id: null,
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
        setImageInput("");
        setTagInput("");
        setVariantInput({ color: "", size: "", price: "", stock: "" });
      } else {
        Swal.fire("Error", data.error || "Failed to save product", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error. Try again.", "error");
      console.error(err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/sunglasses/${id}`, { method: "DELETE" });
        if (res.ok) {
          setProducts(products.filter((p) => p.id !== id));
          Swal.fire("Deleted!", "Product has been deleted.", "success");
        } else {
          Swal.fire("Error", "Failed to delete product.", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Network error. Try again.", "error");
        console.error(err);
      }
    }
  };

  // Edit
  const handleEdit = (product) => {
    setFormData({ ...product });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* Add/Edit Form */}
      {/* ... same UI as before ... */}
    </div>
  );
};

export default ManageSunglasses;
