import React, { useState } from "react";
import Swal from "sweetalert2";

export default function CategoryForm({
  apiUrl = "https://shopnest-ecom.onrender.com/categories",
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

  // ✅ URL or path validation
  const isValidLink = (value) => {
    if (!value) return true; // optional
    // Allow full URLs, relative paths, or IDs
    const pathRegex = /^\/[A-Za-z0-9_\-/]*$/; // e.g. /category/snacks or /id/123
    const idRegex = /^[A-Za-z0-9_-]{8,}$/; // e.g. MongoDB-like IDs
    try {
      const url = new URL(value);
      if (["http:", "https:"].includes(url.protocol)) return true;
    } catch (_) {
      // not a full URL, check if it's a path or ID
    }
    return pathRegex.test(value) || idRegex.test(value);
  };

  // ✅ Image URL validation (only full URLs)
  const isValidImageUrl = (value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const resetForm = () => {
    setFormData({ title: "", image: "", link: "" });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      Swal.fire("Validation Error", "Title is required.", "error");
      return;
    }

    if (formData.image && !isValidImageUrl(formData.image)) {
      Swal.fire(
        "Invalid Image URL",
        "Please enter a valid Image URL starting with http:// or https://.",
        "error"
      );
      return;
    }

    if (formData.link && !isValidLink(formData.link)) {
      Swal.fire(
        "Invalid Link",
        "Link must be a valid path (/category/id), an ID, or a full URL.",
        "error"
      );
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
      Swal.fire("Success", "Category saved successfully!", "success");

      resetForm();
      if (typeof onSuccess === "function") onSuccess(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Failed to save category.", "error");
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
          {formData.image && isValidImageUrl(formData.image) && (
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

        {/* ✅ Link (optional, supports /path, URL, or ID) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title Link (optional)
          </label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="/category/snacks or https://example.com or categoryID"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          {formData.link && isValidLink(formData.link) && (
            <p className="text-xs text-green-600 mt-1">✅ Valid link</p>
          )}
          {formData.link && !isValidLink(formData.link) && (
            <p className="text-xs text-red-600 mt-1">
              ⚠ Invalid link format. Use a path (/category/id), full URL, or ID.
            </p>
          )}
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
