// src/components/HeroCarouselManager.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API_URL = "https://shopnest-serveres.onrender.com/heroCarousel";

const HeroCarouselManager = () => {
  const [slides, setSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    buttonText: "",
    colorHex: "",
    image: "",
  });

  // ✅ Fetch slides
  const fetchSlides = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not fetch slides.", "error");
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the slide permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        setSlides((prev) => prev.filter((s) => s.id !== id && s._id !== id));
        Swal.fire("Deleted!", "Slide deleted successfully.", "success");
      } catch (err) {
        Swal.fire("Error", "Failed to delete slide.", "error");
      }
    }
  };

  // ✅ Open Edit Modal
  const openEditModal = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || "",
      description: slide.description || "",
      buttonText: slide.buttonText || "",
      colorHex: slide.colorHex || "",
      image: slide.image || "",
    });
  };

  // ✅ Close Modal
  const closeModal = () => {
    setEditingSlide(null);
  };

  // ✅ Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedSlide = { ...editingSlide, ...formData };
      const res = await fetch(`${API_URL}/${editingSlide.id || editingSlide._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlide),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();

      setSlides((prev) =>
        prev.map((s) =>
          s.id === data.id || s._id === data._id ? data : s
        )
      );

      Swal.fire("Updated!", "Slide updated successfully.", "success");
      closeModal();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update slide.", "error");
    }
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Hero Carousel Manager</h1>

      {/* ✅ Slides Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Button Text</th>
              <th className="p-2 border">Color</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr key={slide.id || slide._id} className="hover:bg-gray-100">
                <td className="p-2 border">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2 border">{slide.title}</td>
                <td className="p-2 border">{slide.description}</td>
                <td className="p-2 border">{slide.buttonText}</td>
                <td className="p-2 border">
                  <div
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: slide.colorHex }}
                  ></div>
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => openEditModal(slide)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(slide.id || slide._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    onClick={() =>
                      Swal.fire({
                        title: slide.title,
                        html: `
                          <img src="${slide.image}" class="w-full rounded mb-2" />
                          <p>${slide.description}</p>
                          <p><b>Button:</b> ${slide.buttonText}</p>
                          <p><b>Color:</b> ${slide.colorHex}</p>
                        `,
                        showCloseButton: true,
                        showConfirmButton: false,
                      })
                    }
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
            {slides.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No slides found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Edit Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Slide</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Button Text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Color (e.g. #ff6600)"
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full border p-2 rounded"
                required
              />

              {/* Live Image Preview */}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded mt-2 border"
                />
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroCarouselManager;
