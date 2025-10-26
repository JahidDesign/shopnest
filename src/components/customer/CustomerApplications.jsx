import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function CustomerApplications() {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    axios.get("https://shopnest-ecom.onrender.com/orders")
      .then((res) => {
        const myApps = res.data.filter(app => app.email === user.email);
        setApplications(myApps);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p className="text-center text-orange-500 font-bold mt-10 animate-pulse">Loading orders...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">📋 My Orders</h2>
      {applications.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Unit Price</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{app.productName}</td>
                  <td className="p-3">{app.quantity}</td>
                  <td className="p-3">{app.unitPrice.toLocaleString()}৳</td>
                  <td className="p-3 font-bold">{app.totalPrice.toLocaleString()}৳</td>
                  <td className={`p-3 font-semibold ${
                    app.status === "Pending" ? "text-yellow-600" :
                    app.status === "Rejected" ? "text-red-600" : "text-green-600"
                  }`}>{app.status}</td>
                  <td className="p-3">{new Date(app.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
