import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

const ManageReviews = () => {
  const { user, isAdmin, token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL || "https://shopnest-backend.onrender.com";

  useEffect(() => {
    if (!isAdmin) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${API_URL}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
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
        <title>Manage Reviews | ShopNest Admin</title>
        <meta
          name="description"
          content="Admin panel for managing all customer reviews on ShopNest Bangladesh."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Reviews</h1>

        {loading ? (
          <p className="text-gray-600">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600">No reviews found.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review._id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{review.productName}</h2>
                    <p className="text-gray-500">Reviewer: {review.userName}</p>
                    <p className="text-gray-500">Email: {review.userEmail}</p>
                    <p className="text-gray-700 mt-1">{review.comment}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-500 font-semibold">
                      {Array.from({ length: review.rating }).map((_, i) => "★")}
                      {Array.from({ length: 5 - review.rating }).map((_, i) => "☆")}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ManageReviews;
