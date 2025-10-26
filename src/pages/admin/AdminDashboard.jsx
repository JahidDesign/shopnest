import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

// Collections
const collections = [
  "smartphones",
  "sportsproducts",
  "newproducts",
  "menproducts",
  "hotproducts",
  "womentproducts",
  "glosoryproducts",
];

const AdminDashboard = () => {
  const [collection, setCollection] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const initialForm = {
    name: "", sku: "", brand: "", category: "", subcategory: "", price: "",
    hasDiscount: false, discountPrice: "", discountStart: "", discountEnd: "",
    stock: "", status: "published", featured: false, weight: "", dimensions: "",
    description: "", images: [], tags: [], variants: [], metaTitle: "",
    metaDescription: "", metaKeywords: "", relatedProducts: [], rating: 0,
  };
  const [formData, setFormData] = useState(initialForm);
  const [imageInput, setImageInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [variantInput, setVariantInput] = useState({ color: "", size: "", price: "", stock: "" });
  const [hoverRating, setHoverRating] = useState(0);

  // Fetch products
  const fetchProducts = async () => {
    if (!collection) return;
    setLoading(true);
    try {
      const res = await fetch(`https://shopnest-ecom.onrender.com/${collection}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [collection]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData(prev => ({ ...prev, images: [...prev.images, imageInput] }));
    setImageInput("");
  };
  const handleRemoveImage = (idx) =>
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (!tag || formData.tags.includes(tag)) return;
    setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagInput("");
  };
  const handleRemoveTag = (idx) =>
    setFormData(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));

  const handleAddVariant = () => {
    if (!variantInput.color || !variantInput.size || !variantInput.price) {
      Swal.fire("Warning", "Fill all variant fields!", "warning");
      return;
    }
    setFormData(prev => ({ ...prev, variants: [...prev.variants, { ...variantInput }] }));
    setVariantInput({ color: "", size: "", price: "", stock: "" });
  };
  const handleRemoveVariant = (idx) =>
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!collection) return Swal.fire("Select Collection", "Please select a collection", "warning");
    if (!formData.name || !formData.category || !formData.price || formData.images.length === 0) {
      return Swal.fire("Missing Fields", "Fill required fields and add at least one image.", "warning");
    }
    if (formData.hasDiscount && (!formData.discountPrice || parseFloat(formData.discountPrice) >= parseFloat(formData.price))) {
      return Swal.fire("Invalid Discount", "Discount price must be less than regular price.", "warning");
    }

    try {
      const url = editingProduct ? `https://shopnest-ecom.onrender.com/${collection}/${editingProduct._id}` : `https://shopnest-ecom.onrender.com/${collection}`;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", `Product ${editingProduct ? "updated" : "added"} successfully!`, "success");
        setFormData(initialForm);
        setEditingProduct(null);
        fetchProducts();
      } else {
        Swal.fire("Error", data.error || "Failed to submit product", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Network error", "error");
      console.error(err);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setHoverRating(product.rating || 0);
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Delete product?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (confirmed.isConfirmed) {
      try {
        const res = await fetch(`https://shopnest-ecom.onrender.com/${collection}/${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire("Deleted!", "Product deleted successfully.", "success");
          fetchProducts();
        } else {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Network error", "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-8">
      {/* Collection selector */}
      <div className="mb-4 flex items-center gap-2">
        <select
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-orange-500 outline-none"
        >
          <option value="">Select Collection</option>
          {collections.map(col => (
            <option key={col} value={col}>{col.charAt(0).toUpperCase() + col.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Form */}
      <div className="bg-white shadow p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Product Name *" value={formData.name} onChange={handleChange} className="border p-2 rounded"/>
          <input type="text" name="sku" placeholder="SKU / Code" value={formData.sku} onChange={handleChange} className="border p-2 rounded"/>
          <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="border p-2 rounded"/>
          <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded">
            <option value="">Category *</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home & Garden</option>
            <option value="Sports">Sports</option>
          </select>
          <input type="text" name="subcategory" placeholder="Subcategory" value={formData.subcategory} onChange={handleChange} className="border p-2 rounded"/>
          <input type="number" name="price" placeholder="Price *" value={formData.price} onChange={handleChange} className="border p-2 rounded"/>
          <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} className="border p-2 rounded"/>
          <input type="text" name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} className="border p-2 rounded"/>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="hasDiscount" checked={formData.hasDiscount} onChange={handleChange}/>
            <span>Apply Discount</span>
          </div>
          {formData.hasDiscount && (
            <>
              <input type="number" name="discountPrice" placeholder="Discount Price" value={formData.discountPrice} onChange={handleChange} className="border p-2 rounded"/>
              <input type="date" name="discountStart" value={formData.discountStart} onChange={handleChange} className="border p-2 rounded"/>
              <input type="date" name="discountEnd" value={formData.discountEnd} onChange={handleChange} className="border p-2 rounded"/>
            </>
          )}
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} rows="3" className="border p-2 rounded md:col-span-2"/>
          <button type="submit" className="md:col-span-2 py-2 bg-orange-500 text-white rounded">{editingProduct ? "Update Product" : "Add Product"}</button>
        </form>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        {loading ? <p>Loading...</p> : (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-orange-100">
              <tr>
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Stock</th>
                <th className="border px-2 py-1">Rating</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No products found</td></tr>
              ) : products.map((p, idx) => (
                <tr key={p._id} className="hover:bg-orange-50">
                  <td className="border px-2 py-1">{idx+1}</td>
                  <td className="border px-2 py-1">{p.name}</td>
                  <td className="border px-2 py-1">৳{p.price}</td>
                  <td className="border px-2 py-1">{p.stock}</td>
                  <td className="border px-2 py-1">{p.rating}</td>
                  <td className="border px-2 py-1 flex gap-2">
                    <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
