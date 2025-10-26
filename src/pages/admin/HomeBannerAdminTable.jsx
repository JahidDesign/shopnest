// src/components/HomeBannerAdminTable.jsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_URL = "https://shopnest-ecom.onrender.com/carouselRoutes"; // your API route

const HomeBannerAdminTable = () => {
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    link: "",
  });

  const navigate = useNavigate();

  // ---------------- FETCH BANNERS ----------------
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      Swal.fire("Error", "Failed to fetch banners.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HANDLE INPUT ----------------
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ---------------- ADD NEW BANNER ----------------
  const handleAddBanner = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      Swal.fire("Error", "Please provide a valid title and image URL.", "error");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        Swal.fire("Success!", "Banner added successfully!", "success");
        setFormData({ title: "", subtitle: "", imageUrl: "", link: "" });
        fetchBanners();
      } else {
        Swal.fire("Error", "Failed to add banner!", "error");
      }
    } catch (error) {
      console.error("Error adding banner:", error);
    }
  };

  // ---------------- EDIT BANNER ----------------
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      link: banner.link,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/${editingBanner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        Swal.fire("Updated!", "Banner updated successfully!", "success");
        setEditingBanner(null);
        setFormData({ title: "", subtitle: "", imageUrl: "", link: "" });
        fetchBanners();
      } else {
        Swal.fire("Error", "Failed to update banner!", "error");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
    }
  };

  // ---------------- DELETE BANNER ----------------
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the banner.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (res.ok) {
            Swal.fire("Deleted!", "Banner deleted successfully.", "success");
            fetchBanners();
          } else {
            Swal.fire("Error", "Failed to delete banner.", "error");
          }
        } catch (error) {
          console.error("Error deleting banner:", error);
        }
      }
    });
  };

  // ---------------- CANCEL EDIT ----------------
  const handleCancelEdit = () => {
    setEditingBanner(null);
    setFormData({ title: "", subtitle: "", imageUrl: "", link: "" });
  };

  // ---------------- HANDLE LINK NAVIGATION ----------------
  const handleLinkClick = (link) => {
    if (!link) return;
    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🏠 Home Banner Management
      </h2>

      {/* ================= Add/Edit Banner Form ================= */}
      <form
        onSubmit={editingBanner ? handleUpdateBanner : handleAddBanner}
        className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Banner Title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            name="subtitle"
            placeholder="Subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            name="link"
            placeholder="Button Link (internal path or external URL)"
            value={formData.link}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Live Image Preview */}
        {formData.imageUrl && (
          <div className="mt-4">
            <p className="text-gray-600 text-sm mb-1">Image Preview:</p>
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-60 h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
              editingBanner
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {editingBanner ? "Update Banner" : "Add Banner"}
          </button>

          {editingBanner && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= Banner Table ================= */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Subtitle</th>
              <th className="py-3 px-4 text-left">Link</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Loading banners...
                </td>
              </tr>
            ) : banners.length > 0 ? (
              banners.map((banner) => (
                <tr key={banner._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-24 h-16 rounded-lg object-cover border"
                    />
                  </td>
                  <td className="py-3 px-4">{banner.title}</td>
                  <td className="py-3 px-4">{banner.subtitle}</td>
                  <td className="py-3 px-4 text-blue-600 underline cursor-pointer">
                    {banner.link ? (
                      <span onClick={() => handleLinkClick(banner.link)}>
                        {banner.link}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No banners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeBannerAdminTable;
