// File: src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

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

  // Form setup
  const initialForm = {
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
  };

  const [formData, setFormData] = useState(initialForm);
  const [imageInput, setImageInput] = useState("");
  const [search, setSearch] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    if (!collection) return;
    setLoading(true);
    try {
      const res = await fetch(`https://shopnest-ecom.onrender.com/${collection}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [collection]);

  // Input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, imageInput] }));
    setImageInput("");
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingProduct(null);
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collection)
      return Swal.fire("Missing!", "Please select a collection", "warning");

    if (!formData.name || !formData.price)
      return Swal.fire("Invalid!", "Name and Price are required", "warning");

    const url = editingProduct
      ? `https://shopnest-ecom.onrender.com/${collection}/${editingProduct._id}`
      : `https://shopnest-ecom.onrender.com/${collection}`;
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        Swal.fire(
          "Success",
          `Product ${editingProduct ? "updated" : "added"} successfully!`,
          "success"
        );
        fetchProducts();
        resetForm();
      } else {
        Swal.fire("Error", "Failed to save product", "error");
      }
    } catch {
      Swal.fire("Error", "Network issue", "error");
    }
  };

  // Edit / Delete
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (confirmed.isConfirmed) {
      try {
        const res = await fetch(
          `https://shopnest-ecom.onrender.com/${collection}/${id}`,
          { method: "DELETE" }
        );
        if (res.ok) {
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          fetchProducts();
        }
      } catch {
        Swal.fire("Error", "Failed to delete product", "error");
      }
    }
  };

  // Filter products by search
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto mt-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-orange-600">
          🛒 Admin Dashboard
        </h1>

        <div className="flex gap-2">
          <select
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Collection</option>
            {collections.map((col) => (
              <option key={col} value={col}>
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="🔍 Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editingProduct ? "✏️ Edit Product" : "➕ Add Product"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name *"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price *"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* Image management */}
          <div className="md:col-span-2">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Image URL"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="border p-2 rounded flex-1"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-green-500 text-white px-4 rounded"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt=""
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="border p-2 rounded md:col-span-2"
          />

          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <p className="text-center p-6">Loading...</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="bg-orange-100 text-gray-700">
              <tr>
                <th className="border px-2 py-2">#</th>
                <th className="border px-2 py-2">Image</th>
                <th className="border px-2 py-2">Name</th>
                <th className="border px-2 py-2">Price</th>
                <th className="border px-2 py-2">Stock</th>
                <th className="border px-2 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p._id} className="hover:bg-orange-50">
                    <td className="border px-2 py-2">{i + 1}</td>
                    <td className="border px-2 py-2">
                      <img
                        src={p.images?.[0]}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="border px-2 py-2">{p.name}</td>
                    <td className="border px-2 py-2 text-orange-600 font-semibold">
                      ৳{p.price}
                    </td>
                    <td className="border px-2 py-2">{p.stock}</td>
                    <td className="border px-2 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
