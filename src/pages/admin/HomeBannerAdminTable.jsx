import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const HomeBannerAdminTable = () => {
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);

  // Fetch banners
  useEffect(() => {
    fetch("https://shopnest-serveres.onrender.com/homebanners")
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((err) => console.error("Error loading banners:", err));
  }, []);

  // Handle Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This banner will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6600",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://shopnest-serveres.onrender.com/homebanners/${id}`, { method: "DELETE" })
          .then(() => {
            setBanners(banners.filter((b) => b.id !== id));
            Swal.fire("Deleted!", "Banner removed successfully.", "success");
          })
          .catch(() =>
            Swal.fire("Error", "Failed to delete banner.", "error")
          );
      }
    });
  };

  // Handle Edit Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();

    fetch(`https://shopnest-serveres.onrender.com/homebanners/${editingBanner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingBanner),
    })
      .then((res) => res.json())
      .then((updated) => {
        setBanners(banners.map((b) => (b.id === updated.id ? updated : b)));
        Swal.fire("Updated!", "Banner updated successfully!", "success");
        setEditingBanner(null);
      })
      .catch(() =>
        Swal.fire("Error", "Failed to update banner.", "error")
      );
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-left text-orange-600 mb-6">
        🧡 Manage Home Banners
      </h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Subtitle</th>
              <th className="p-3 text-left">Button</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No banners found.
                </td>
              </tr>
            ) : (
              banners.map((b) => (
                <tr
                  key={b.id}
                  className="border-b hover:bg-orange-50 transition"
                >
                  <td className="p-3">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 font-semibold text-gray-800">{b.title}</td>
                  <td className="p-3 text-gray-600">{b.subtitle}</td>
                  <td className="p-3">
                    {b.buttonText ? (
                      <a
                        href={b.buttonLink}
                        className="text-orange-600 hover:underline"
                      >
                        {b.buttonText}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => setEditingBanner(b)}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm transition-all">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg scale-100 animate-fadeIn">
            <h3 className="text-xl font-bold text-orange-600 mb-4">
              ✏️ Edit Banner
            </h3>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Image URL
                </label>
                <input
                  type="text"
                  value={editingBanner.image}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter banner title"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingBanner.subtitle}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      subtitle: e.target.value,
                    })
                  }
                  placeholder="Enter banner subtitle"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Button Text
                </label>
                <input
                  type="text"
                  value={editingBanner.buttonText}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      buttonText: e.target.value,
                    })
                  }
                  placeholder="e.g., Shop Now"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                  Button Link
                </label>
                <input
                  type="text"
                  value={editingBanner.buttonLink}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      buttonLink: e.target.value,
                    })
                  }
                  placeholder="/products"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
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

export default HomeBannerAdminTable;
