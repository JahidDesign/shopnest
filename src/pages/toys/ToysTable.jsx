import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";

const ToysTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://shopnest-ecom.onrender.com/chilldsToy";

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF6600",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          setProducts((prev) => prev.filter((p) => p._id !== id));
        } else {
          Swal.fire("Error", "Failed to delete product.", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Network error.", "error");
      }
    }
  };

  // Edit product
  const handleEdit = (product) => {
    Swal.fire("Edit Product", "Redirect to edit page or modal", "info");
    // You can implement a modal or navigate to the form with pre-filled data
    console.log("Edit product:", product);
  };

  if (loading) return <p className="text-center mt-10 text-orange-600 animate-pulse">Loading products...</p>;

  return (
    <div className="max-w-7xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Manage Products</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price (৳)</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">No products found.</td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-orange-50 transition">
                <td className="px-4 py-2">
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="h-12 w-12 object-cover rounded" /> : "No Image"}
                </td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{p.price}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">{p.rating} / 5</td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <button onClick={() => handleEdit(p)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1">
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToysTable;
