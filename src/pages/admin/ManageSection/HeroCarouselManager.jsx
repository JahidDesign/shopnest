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

  // ✅ Fetch slides from server
  const fetchSlides = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch slides");
      const data = await res.json();
      setSlides(data);
    } catch (error) {
      console.error("Error fetching slides:", error);
      Swal.fire("Error", "Could not fetch slides.", "error");
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the slide.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSlides((prev) => prev.filter((s) => s._id !== id && s.id !== id));
      Swal.fire("Deleted!", "Slide deleted successfully.", "success");
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "Failed to delete slide.", "error");
    }
  };

  // ✅ Open edit modal
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

  // ✅ Close modal
  const closeModal = () => {
    setEditingSlide(null);
  };

  // ✅ Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingSlide) return;

    const slideId = editingSlide._id || editingSlide.id;
    const updatedSlide = { ...formData };

    try {
      const res = await fetch(`${API_URL}/${slideId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlide),
      });
      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();

      // Update UI immediately
      setSlides((prev) =>
        prev.map((s) =>
          s._id === slideId || s.id === slideId ? updated : s
        )
      );

      Swal.fire("Updated!", "Slide updated successfully.", "success");
      closeModal();
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", "Could not update slide.", "error");
    }
  };

  return (
    <div className="p-6 relative min-h-screen bg-gradient-to-br from-orange-50 to-white">
      
      {/* ✅ Slides Table */}
      <div className="overflow-x-auto shadow-lg rounded-none bg-white">
        <table className="min-w-full border rounded-none text-sm">
          <thead className="bg-orange-100 text-gray-800 font-semibold">
            <tr>
              <th className="p-3 border">Preview</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Button Text</th>
              <th className="p-3 border">Color</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr key={slide._id || slide.id} className="hover:bg-orange-50">
                <td className="p-2 border text-center">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-24 h-16 object-cover rounded-md mx-auto"
                  />
                </td>
                <td className="p-2 border font-medium">{slide.title}</td>
                <td className="p-2 border">{slide.description}</td>
                <td className="p-2 border text-center">{slide.buttonText}</td>
                <td className="p-2 border text-center">
                  <div
                    className="w-8 h-8 rounded border mx-auto"
                    style={{ backgroundColor: slide.colorHex }}
                  ></div>
                </td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id || slide.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      Swal.fire({
                        title: slide.title,
                        html: `
                          <img src="${slide.image}" class="w-full rounded mb-2 shadow-sm" />
                          <p>${slide.description}</p>
                          <p><b>Button:</b> ${slide.buttonText}</p>
                          <p><b>Color:</b> ${slide.colorHex}</p>
                        `,
                        showCloseButton: true,
                        showConfirmButton: false,
                      })
                    }
                    className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
            {slides.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 font-medium"
                >
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
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-orange-700">
              ✏️ Edit Slide
            </h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded p-2"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Button Text"
                value={formData.buttonText}
                onChange={(e) =>
                  setFormData({ ...formData, buttonText: e.target.value })
                }
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Color (e.g. #ff6600)"
                value={formData.colorHex}
                onChange={(e) =>
                  setFormData({ ...formData, colorHex: e.target.value })
                }
                className="w-full border rounded p-2"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full border rounded p-2"
                required
              />

              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded border mt-2"
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
