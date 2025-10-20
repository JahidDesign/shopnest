import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("https://shopnest-serveres.onrender.com/products");
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

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://shopnest-serveres.onrender.com/products/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          Swal.fire("Deleted!", "Product removed.", "success");
          fetchProducts();
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete product", "error");
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading products...</div>;

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Price (৳)</th>
            <th className="px-4 py-2">Discount</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Images</th>
            <th className="px-4 py-2">Tags</th>
            <th className="px-4 py-2">Variants</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <tr key={p._id} className="border-b hover:bg-orange-50 transition">
              <td className="px-4 py-2 text-center">{idx + 1}</td>
              <td className="px-4 py-2 font-semibold">{p.name}</td>
              <td className="px-4 py-2">{p.category}</td>
              <td className="px-4 py-2">{p.price}</td>
              <td className="px-4 py-2">{p.hasDiscount ? p.discountPrice : "-"}</td>
              <td className="px-4 py-2">{p.stock || "-"}</td>

              {/* Images */}
              <td className="px-4 py-2 flex flex-wrap gap-1">
                {p.images && p.images.map((img, i) => (
                  <img key={i} src={img} alt="" className="h-12 w-12 object-cover rounded border"/>
                ))}
              </td>

              {/* Tags */}
              <td className="px-4 py-2 flex flex-wrap gap-1">
                {p.tags && p.tags.map((tag, i) => (
                  <span key={i} className="bg-orange-100 px-2 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </td>

              {/* Variants */}
              <td className="px-4 py-2 flex flex-col gap-1">
                {p.variants && p.variants.map((v, i) => (
                  <span key={i} className="text-sm">
                    {v.color}/{v.size} - ৳{v.price} ({v.stock})
                  </span>
                ))}
              </td>

              {/* Actions */}
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => Swal.fire("Edit", "Edit feature coming soon", "info")}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
