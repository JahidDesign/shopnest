import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

const ManageProducts = () => {
  const { user, isAdmin, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL || "https://shopnest-backend.onrender.com";

  useEffect(() => {
    if (!isAdmin) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAdmin, token]);

  if (!user || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-700 mt-2">
          You must be an admin to access this page.
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Products | ShopNest Admin</title>
        <meta
          name="description"
          content="Admin panel for managing all products on ShopNest Bangladesh."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <ul className="space-y-4">
            {products.map((p) => (
              <li
                key={p._id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <p className="text-gray-500">Category: {p.category}</p>
                  <p className="text-gray-700 font-medium">${p.price}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ManageProducts;
