import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const HomeBannerForm = () => {
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
  });

  const [banners, setBanners] = useState([]);

  // Load banners from local JSON API
  useEffect(() => {
    fetch("https://shopnest-ecom.onrender.com/carouselRoutes")
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((err) => console.error("Error loading banners:", err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.image || !formData.title || !formData.subtitle) {
      Swal.fire("Missing Data", "Please fill all required fields!", "warning");
      return;
    }

    fetch("https://shopnest-ecom.onrender.com/carouselRoutes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((newBanner) => {
        setBanners([...banners, newBanner]);
        Swal.fire("✅ Success!", "Banner added successfully!", "success");
        setFormData({
          image: "",
          title: "",
          subtitle: "",
          buttonText: "",
          buttonLink: "",
        });
      })
      .catch((err) => console.error("Error adding banner:", err));
  };

  // Handle delete banner
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the banner.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6600",
      cancelButtonColor: "#ccc",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://shopnest-ecom.onrender.com/carouselRoutes/${id}`, { method: "DELETE" })
          .then(() => {
            setBanners(banners.filter((b) => b.id !== id));
            Swal.fire("Deleted!", "Banner removed successfully.", "success");
          })
          .catch((err) => console.error("Error deleting banner:", err));
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-left text-orange-600 mb-8">
         Manage Home Banners
      </h2>

      {/* --- Banner Form --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-5"
      >
        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-lg border"
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter banner title"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-semibold mb-1">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Enter banner subtitle"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Button fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Button Text
            </label>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              placeholder="e.g., Shop Now"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Button Link
            </label>
            <input
              type="text"
              name="buttonLink"
              value={formData.buttonLink}
              onChange={handleChange}
              placeholder="e.g., /products"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition"
        >
          Add Banner
        </button>
      </form>

      {/* --- Banner Preview Grid --- */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition relative bg-white"
          >
            <img
              src={b.image}
              alt={b.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{b.title}</h3>
              <p className="text-gray-600 text-sm">{b.subtitle}</p>
              {b.buttonText && (
                <a
                  href={b.buttonLink}
                  className="inline-block mt-3 px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition"
                >
                  {b.buttonText}
                </a>
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(b.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeBannerForm;
