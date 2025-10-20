import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const API_URL = "https://shopnest-serveres.onrender.com/visitors";

const VisitorsForm = () => {
  const [visitors, setVisitors] = useState([]);
  const [image, setImage] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔹 Load all visitors
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setVisitors)
      .catch((err) => console.error("Error loading visitors:", err));
  }, []);

  // 🔹 Add new visitor
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return Swal.fire("Error", "Please provide an image URL!", "error");

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API_URL}/${editId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      if (!res.ok) throw new Error("Failed to save visitor");

      Swal.fire("Success", editId ? "Image updated!" : "Visitor added!", "success");
      setImage("");
      setEditId(null);

      const updated = await fetch(API_URL).then((r) => r.json());
      setVisitors(updated);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  // 🔹 Delete visitor
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the image.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      Swal.fire("Deleted!", "Visitor image removed!", "success");
      setVisitors(visitors.filter((v) => v._id !== id));
    } catch {
      Swal.fire("Error", "Failed to delete visitor", "error");
    }
  };

  // 🔹 Edit visitor
  const handleEdit = (visitor) => {
    setEditId(visitor._id);
    setImage(visitor.image);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8 md:px-12">
      <h1 className="text-3xl font-bold text-[#FF6600] mb-8 text-center">
        🧍 Visitors Gallery
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 mb-12 border border-[#FFDAB9]/40"
      >
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6600] outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#FF6600] to-[#FF7F32] text-white px-6 py-3 rounded-lg hover:from-[#CC5500] hover:to-[#FF6600] transition-all font-semibold"
          >
            {editId ? "Update Image" : "Add Image"}
          </button>
        </div>
      </form>

      {/* Gallery */}
      {visitors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visitors.map((visitor, i) => (
            <motion.div
              key={visitor._id || i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-[#FFDAB9]/40"
            >
              <img
                src={visitor.image}
                alt="Visitor"
                className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="flex justify-between p-4">
                <button
                  onClick={() => handleEdit(visitor)}
                  className="text-[#FF6600] font-medium hover:underline"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(visitor._id)}
                  className="text-red-500 font-medium hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No visitors added yet!</p>
      )}
    </div>
  );
};

export default VisitorsForm;
