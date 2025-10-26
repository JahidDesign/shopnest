import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://shopnest-ecom.onrender.com/products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch products", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://shopnest-ecom.onrender.com/products/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          Swal.fire("Deleted!", "Product removed successfully.", "success");
          fetchProducts();
        } else {
          Swal.fire("Error", "Failed to delete product", "error");
        }
      } catch (err) {
        Swal.fire("Error", "Network error occurred", "error");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-600 text-lg">
        Loading products...
      </div>
    );

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Price (৳)</th>
            <th className="px-4 py-2 text-left">Discount</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Images</th>
            <th className="px-4 py-2 text-left">Tags</th>
            <th className="px-4 py-2 text-left">Variants</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <motion.tr
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="border-b hover:bg-orange-50 transition"
            >
              <td className="px-4 py-2">{idx + 1}</td>
              <td className="px-4 py-2 font-semibold text-gray-800">
                {p.name}
              </td>
              <td className="px-4 py-2">{p.category}</td>
              <td className="px-4 py-2">{p.price}</td>
              <td className="px-4 py-2">
                {p.hasDiscount ? p.discountPrice : "-"}
              </td>
              <td className="px-4 py-2">{p.stock || "-"}</td>

              {/* Images */}
              <td className="px-4 py-2 flex flex-wrap gap-1">
                {p.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="h-12 w-12 object-cover rounded border"
                  />
                ))}
              </td>

              {/* Tags */}
              <td className="px-4 py-2 flex flex-wrap gap-1">
                {p.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </td>

              {/* Variants */}
              <td className="px-4 py-2 flex flex-col gap-1 text-sm">
                {p.variants?.map((v, i) => (
                  <span key={i} className="text-gray-700">
                    {v.color}/{v.size} – ৳{v.price} ({v.stock})
                  </span>
                ))}
              </td>

              {/* Actions */}
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    Swal.fire("Edit", "Edit feature coming soon!", "info")
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                >
                  Edit
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
