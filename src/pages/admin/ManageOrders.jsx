import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

const ManageOrders = () => {
  const { user, isAdmin, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL || "https://shopnest-backend.onrender.com";

  useEffect(() => {
    if (!isAdmin) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
        <title>Manage Orders | ShopNest Admin</title>
        <meta
          name="description"
          content="Admin panel for managing all customer orders on ShopNest Bangladesh."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div>
                  <h2 className="text-lg font-semibold">Order #{order._id}</h2>
                  <p className="text-gray-500">Customer: {order.customerName}</p>
                  <p className="text-gray-500">Email: {order.customerEmail}</p>
                  <p className="text-gray-500">
                    Total Items: {order.items?.length || 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-medium">
                    Total: ${order.totalPrice?.toFixed(2) || 0}
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      order.status === "delivered"
                        ? "text-green-600"
                        : order.status === "pending"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  >
                    Status: {order.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ManageOrders;
