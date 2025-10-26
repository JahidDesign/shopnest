import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API_URL = "https://shopnest-ecom.onrender.com/categories";

// ✅ Enhanced URL or Path validator
const isValidUrlOrPath = (link) => {
  if (!link) return true;
  try {
    const parsed = new URL(link);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    // Allow relative paths (e.g. /shop, /tours/123)
    return link.startsWith("/");
  }
};

const CategoryAdminTable = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ title: "", image: "", link: "" });

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      Swal.fire("Error", "Title is required!", "warning");
      return;
    }
    if (!isValidUrlOrPath(formData.image)) {
      Swal.fire("Error", "Invalid Image URL!", "warning");
      return;
    }
    if (!isValidUrlOrPath(formData.link)) {
      Swal.fire("Error", "Invalid Link (must be URL or path)!", "warning");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      const newCat = await res.json();
      setCategories([...categories, newCat]);
      setFormData({ title: "", image: "", link: "" });
      Swal.fire("Success", "Category added successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add category", "error");
    }
  };

  // ✅ Delete category
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6600",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      setCategories(categories.filter((c) => c._id !== id));
      Swal.fire("Deleted!", "Category removed.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete category", "error");
    }
  };

  // ✅ Update category
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory.title.trim()) {
      Swal.fire("Error", "Title is required!", "warning");
      return;
    }
    if (!isValidUrlOrPath(editingCategory.image)) {
      Swal.fire("Error", "Invalid Image URL!", "warning");
      return;
    }
    if (!isValidUrlOrPath(editingCategory.link)) {
      Swal.fire("Error", "Invalid Link (must be URL or path)!", "warning");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      if (!res.ok) throw new Error("Failed to update category");
      const updated = await res.json();
      setCategories(
        categories.map((c) => (c._id === updated._id ? updated : c))
      );
      setEditingCategory(null);
      Swal.fire("Updated!", "Category updated successfully.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update category", "error");
    }
  };

  // ✅ Smart link renderer (works for URLs & local paths)
  const renderLink = (link) => {
    if (!link) return <span className="text-gray-400">N/A</span>;
    const isExternal = /^https?:\/\//.test(link);
    return isExternal ? (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-600 hover:underline"
      >
        {link}
      </a>
    ) : (
      <a href={link} className="text-green-600 hover:underline">
        {link}
      </a>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
        🧡 Manage Categories
      </h2>

      {/* ✅ Add Form */}
      <form
        onSubmit={handleAddCategory}
        className="flex flex-col sm:flex-row items-center gap-3 mb-8"
      >
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full sm:w-1/3 border p-2 rounded focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full sm:w-1/3 border p-2 rounded focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="text"
          placeholder="Link (URL or /path)"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full sm:w-1/3 border p-2 rounded focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
        >
          Add
        </button>
      </form>

      {/* ✅ Categories Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Link</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length ? (
              categories.map((c) => (
                <tr key={c._id} className="border-b hover:bg-orange-50 transition">
                  <td className="p-3">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold">{c.title}</td>
                  <td className="p-3">{renderLink(c.link)}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => setEditingCategory(c)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-xl font-bold text-orange-600 mb-4">
              Edit Category
            </h3>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                value={editingCategory.title}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, title: e.target.value })
                }
                placeholder="Title"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={editingCategory.image}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, image: e.target.value })
                }
                placeholder="Image URL"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                value={editingCategory.link}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, link: e.target.value })
                }
                placeholder="Link (URL or /path)"
                className="w-full border p-2 rounded"
              />
              {editingCategory.image &&
                isValidUrlOrPath(editingCategory.image) && (
                  <img
                    src={editingCategory.image}
                    alt="preview"
                    className="w-24 h-24 object-cover mt-2 rounded"
                  />
                )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAdminTable;
