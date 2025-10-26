import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const MyPolicies = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const res = await axios.get(`https://shopnest-ecom.onrender.com/orders`);
        const userOrders = res.data.filter((o) => o.email === user.email);
        setPayments(userOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.email]);

  const handlePayNow = (order) => {
    navigate("/payment", {
      state: {
        order,
        amount: order.totalPrice,
        quantity: order.quantity,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading your policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📋 My Policies / Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Policy / Product</th>
              <th className="border p-2">Coverage / Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr key={p._id} className="odd:bg-gray-100">
                  <td className="border p-2">{p.policyTitle || p.productName}</td>
                  <td className="border p-2">{p.coverage || p.quantity}</td>
                  <td className="border p-2">{p.totalPrice?.toLocaleString()}৳</td>
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white font-semibold ${
                        p.status === "Pending"
                          ? "bg-yellow-500"
                          : p.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    >
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="border p-2">
                    {p.status === "Pending" && (
                      <button
                        onClick={() => handlePayNow(p)}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                      >
                        Pay Now
                      </button>
                    )}
                    {p.status === "Completed" && (
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                        Give Review
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  No policies/orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPolicies;
