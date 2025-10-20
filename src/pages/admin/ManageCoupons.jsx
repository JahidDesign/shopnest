// File: src/pages/ManageCoupons.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PlusCircle, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react";

// Sample API endpoint (replace with your backend)
const API_URL = "https://api.shopnest.com/coupons";

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ code: "", discount: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setCoupons(data);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddCoupon = async () => {
    if (!formData.code.trim() || !formData.discount) return;
    try {
      // Call API to add coupon
      setCoupons([...coupons, { id: Date.now(), code: formData.code, discount: formData.discount }]);
      setFormData({ code: "", discount: "" });
      setStatusMessage({ type: "success", text: "Coupon added successfully!" });
    } catch (err) {
      setStatusMessage({ type: "error", text: "Failed to add coupon." });
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleEditCoupon = (coupon) => {
    setFormData({ code: coupon.code, discount: coupon.discount });
    setIsEditing(coupon.id);
  };

  const handleUpdateCoupon = async () => {
    if (!formData.code.trim() || !formData.discount) return;
    try {
      // Call API to update coupon
      setCoupons(coupons.map(c => c.id === isEditing ? { ...c, code: formData.code, discount: formData.discount } : c));
      setFormData({ code: "", discount: "" });
      setIsEditing(null);
      setStatusMessage({ type: "success", text: "Coupon updated successfully!" });
    } catch (err) {
      setStatusMessage({ type: "error", text: "Failed to update coupon." });
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      // Call API to delete coupon
      setCoupons(coupons.filter(c => c.id !== id));
      setStatusMessage({ type: "success", text: "Coupon deleted successfully!" });
    } catch (err) {
      setStatusMessage({ type: "error", text: "Failed to delete coupon." });
    } finally {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <Helmet>
        <html lang="en" />
        <title>Manage Coupons | ShopNest Admin</title>
        <meta name="description" content="Manage discount coupons in ShopNest admin panel. Add, edit, and delete coupons for your e-commerce store in Bangladesh." />
        <meta name="keywords" content="ShopNest coupons, manage coupons, ecommerce admin, discount codes BD, online shopping BD" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-center">Manage Coupons</h1>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 p-4 mb-6 rounded-lg ${
            statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage.type === "success" ? <CheckCircle /> : <AlertCircle />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Add / Edit Form */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          name="code"
          placeholder="Coupon Code"
          value={formData.code}
          onChange={handleChange}
          className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount %"
          value={formData.discount}
          onChange={handleChange}
          className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
        />
        {isEditing ? (
          <button
            onClick={handleUpdateCoupon}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 transition"
          >
            <Edit className="w-5 h-5" /> Update Coupon
          </button>
        ) : (
          <button
            onClick={handleAddCoupon}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 transition"
          >
            <PlusCircle className="w-5 h-5" /> Add Coupon
          </button>
        )}
      </div>

      {/* Coupon List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading coupons...</p>
      ) : (
        <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
          {coupons.length === 0 ? (
            <p className="text-gray-500 text-center">No coupons found.</p>
          ) : (
            <ul className="space-y-4">
              {coupons.map((c) => (
                <li
                  key={c.id}
                  className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 hover:shadow transition"
                >
                  <span className="text-gray-800 font-medium">{c.code} - {c.discount}%</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditCoupon(c)}
                      className="text-yellow-500 hover:text-yellow-600 transition"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
