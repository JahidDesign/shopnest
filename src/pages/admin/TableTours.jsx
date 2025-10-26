import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";

const TourTable = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tours
  const fetchTours = async () => {
    try {
      const res = await fetch("https://shopnest-ecom.onrender.com/tours");
      const data = await res.json();
      setTours(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Delete tour
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This tour will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`https://shopnest-ecom.onrender.com/tours/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setTours(tours.filter((tour) => tour.id !== id));
            Swal.fire("Deleted!", "The tour has been deleted.", "success");
          }
        } catch (error) {
          Swal.fire("Error", "Failed to delete tour.", "error");
        }
      }
    });
  };

  // Edit tour (basic prompt-based edit)
  const handleEdit = async (tour) => {
    const updatedTitle = prompt("Edit tour title:", tour.title);
    if (updatedTitle !== null && updatedTitle.trim() !== "") {
      try {
        const res = await fetch(`https://shopnest-ecom.onrender.com/tours/${tour.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...tour, title: updatedTitle }),
        });
        if (res.ok) {
          setTours(
            tours.map((t) =>
              t.id === tour.id ? { ...t, title: updatedTitle } : t
            )
          );
          Swal.fire("Updated!", "The tour has been updated.", "success");
        }
      } catch (error) {
        Swal.fire("Error", "Failed to update tour.", "error");
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading tours...</p>;
  }

  if (tours.length === 0) {
    return <p className="text-center mt-10">No tours available.</p>;
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b">#</th>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Categories</th>
            <th className="px-4 py-2 border-b">Price ($)</th>
            <th className="px-4 py-2 border-b">Images</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour, idx) => (
            <tr
              key={tour.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
              <td className="px-4 py-2 border-b">{tour.title}</td>
              <td className="px-4 py-2 border-b">
                {tour.categories?.join(", ")}
              </td>
              <td className="px-4 py-2 border-b">{tour.prices}</td>
              <td className="px-4 py-2 border-b flex gap-2">
                {tour.image?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={tour.title}
                    className="w-16 h-12 object-cover rounded-md border border-gray-200"
                  />
                ))}
              </td>
              <td className="px-4 py-2 border-b flex gap-3 justify-center">
                <button
                  onClick={() => handleEdit(tour)}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(tour.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TourTable;
