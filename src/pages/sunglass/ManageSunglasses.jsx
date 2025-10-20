// src/pages/ManageSunglasses.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

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
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://shopnest-serveres.onrender.com/sunglasses");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
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
    if (formData.hasDiscount) {
      if (!formData.discountPrice || parseFloat(formData.discountPrice) >= parseFloat(formData.price)) {
        Swal.fire("Invalid Discount", "Discount price must be less than regular price.", "warning");
        return;
      }
    }

    try {
      let res;
      if (formData.id) {
        // Edit
        res = await fetch(`https://shopnest-serveres.onrender.com/sunglasses/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new
        res = await fetch(`https://shopnest-serveres.onrender.com/sunglasses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (res.ok) {
        Swal.fire("Success", formData.id ? "Product updated!" : "Product added!", "success");

        // Update table
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
        setHoverRating(0);
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
        const res = await fetch(`https://shopnest-serveres.onrender.com/sunglasses/${id}`, { method: "DELETE" });
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
      <div className="text-2xl font-bold text-orange-600 mb-6 text-center">{formData.id ? "Edit Product" : "Add New Product"}</div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name *" value={formData.name} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="text" name="sku" placeholder="SKU / Code" value={formData.sku} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none">
          <option value="">Category *</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home">Home & Garden</option>
          <option value="Sports">Sports</option>
        </select>
        <input type="text" name="subcategory" placeholder="Subcategory" value={formData.subcategory} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="number" name="price" placeholder="Price (৳) *" value={formData.price} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        <input type="text" name="weight" placeholder="Weight (kg)" value={formData.weight} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
        
        <div className="flex items-center gap-2">
          <input type="checkbox" name="hasDiscount" checked={formData.hasDiscount} onChange={handleChange} className="w-4 h-4"/>
          <span>Apply Discount</span>
        </div>
        {formData.hasDiscount && (
          <>
            <input type="number" name="discountPrice" placeholder="Discount Price" value={formData.discountPrice} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
            <input type="date" name="discountStart" value={formData.discountStart} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
            <input type="date" name="discountEnd" value={formData.discountEnd} onChange={handleChange} className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"/>
          </>
        )}

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows="4" className="border p-2 rounded md:col-span-2 focus:ring-2 focus:ring-orange-500 outline-none"/>

        {/* Images */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2">Images *</h4>
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Image URL" value={imageInput} onChange={(e) => setImageInput(e.target.value)} className="border p-2 rounded flex-1"/>
            <button type="button" onClick={handleAddImage} className="bg-orange-500 text-white px-4 py-2 rounded">Add Image</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.images.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt={`img-${i}`} className="h-16 w-16 object-cover rounded border"/>
                <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full">×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="md:col-span-2 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg">
          {formData.id ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Products Table */}
      <h2 className="text-3xl font-bold mb-6 mt-12 text-center">All Sunglasses</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Price (৳)</th>
              <th className="py-2 px-4">Stock</th>
              <th className="py-2 px-4">Rating</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={p.id || idx} className="border-b hover:bg-orange-50 transition">
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4">
                  <img src={p.images?.[0] || `https://i.pravatar.cc/50?img=${idx}`} alt={p.name} className="h-12 w-12 object-cover rounded"/>
                </td>
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{p.category}</td>
                <td className="py-2 px-4">{p.price}</td>
                <td className="py-2 px-4">{p.stock}</td>
                <td className="py-2 px-4">{p.rating} / 5</td>
                <td className="py-2 px-4 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSunglasses;
