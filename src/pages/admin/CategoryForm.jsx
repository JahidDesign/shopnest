import React, { useState } from "react";
import Swal from "sweetalert2";

// ✅ CategoryForm.jsx
// Clean version — only "title" is required.
// "image" and "link" are optional. No unnecessary validation errors.

export default function CategoryForm({
  apiUrl = "https://shopnest-serveres.onrender.com/categories",
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    link: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Simple URL check
  const isValidUrl = (value) => {
    if (!value) return true; // optional fields allowed
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  };

  // ✅ Reset form
  const resetForm = () => {
    setFormData({ title: "", image: "", link: "" });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Title is required.",
      });
      return;
    }

    // Optional field validation (non-blocking for empty)
    if (formData.image && !isValidUrl(formData.image)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Image URL",
        text: "Please enter a valid Image URL (include http:// or https://).",
      });
      return;
    }

    if (formData.link && !isValidUrl(formData.link)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Link URL",
        text: "Please enter a valid Link URL (include http:// or https://).",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        image: formData.image.trim() || null,
        link: formData.link.trim() || null,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Server responded with ${res.status}`);
      }

      const data = await res.json();

      Swal.fire({
        icon: "success",
        title: "Saved Successfully!",
        text: "Category has been added.",
      });

      resetForm();
      if (typeof onSuccess === "function") onSuccess(data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error Saving Category",
        text: err.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Add Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ✅ Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Dairy, Snacks"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        {/* ✅ Image URL (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {formData.image && isValidUrl(formData.image) && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-1">Image Preview:</p>
              <img
                src={formData.image}
                alt="Preview"
                className="w-24 h-24 object-cover border rounded-lg"
              />
            </div>
          )}
        </div>

        {/* ✅ Link (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title Link (optional)
          </label>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com/category/dairy"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* ✅ Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            disabled={loading}
          >
            Reset
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2"
            disabled={loading}
          >
            {loading && (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                />
              </svg>
            )}
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
