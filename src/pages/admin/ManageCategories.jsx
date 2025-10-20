// File: src/pages/ManageCategories.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PlusCircle, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react";

// Sample API endpoint (replace with your backend)
const API_URL = "https://api.shopnest.com/categories";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddCategory = async () => {
    if (!formData.name.trim()) return;
    try {
      // Call API to add category
      // await fetch(API_URL, { method: "POST", body: JSON.stringify(formData) })
      setCategories([...categories, { id: Date.now(), name: formData.name }]);
      setFormData({ name: "" });
      setStatusMessage({ type: "success", text: "Category added successfully!" });
    } catch (err) {
      setStatusMessage({ type: "error", text: "Failed to add category." });
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleEditCategory = (category) => {
    setFormData({ name: category.name });
    setIsEditing(category.id);
  };

  const handleUpdateCategory = async () => {
    if (!formData.name.trim()) return;
    try {
      // Call API to update category
      setCategories(categories.map(cat => cat.id === isEditing ? { ...cat, name: formData.name } : cat));
      setFormData({ name: "" });
      setIsEditing(null);
      setStatusMessage({ type: "success", text: "Category updated successfully!" });
    } catch (err) {
      setStatusMessage({ type: "error", text: "Failed to update category." });
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      // Call API to delete category
      setCategories(categories.filter(cat => cat.id !== id));
      setStatusMessage({ type: "success", text: "Category deleted successfully!" });
    } catch (err) {
      setStatusMessage({ type: "error", text: "Failed to delete category." });
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <Helmet>
        <html lang="en" />
        <title>Manage Categories | ShopNest Admin</title>
        <meta name="description" content="Manage product categories in ShopNest admin panel. Add, edit, and delete categories efficiently." />
        <meta name="keywords" content="ShopNest categories, manage categories, ecommerce admin, product categories BD" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-center">Manage Categories</h1>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 p-4 mb-6 rounded-lg ${
            statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
          className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
        />
        {isEditing ? (
          <button
            onClick={handleUpdateCategory}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 transition"
          >
            <Edit className="w-5 h-5" /> Update Category
          </button>
        ) : (
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 transition"
          >
            <PlusCircle className="w-5 h-5" /> Add Category
          </button>
        )}
      </div>

      {/* Category List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading categories...</p>
      ) : (
        <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center">No categories found.</p>
          ) : (
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 hover:shadow transition"
                >
                  <span className="text-gray-800 font-medium">{cat.name}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="text-yellow-500 hover:text-yellow-600 transition"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
