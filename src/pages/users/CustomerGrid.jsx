import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiEdit, FiLogOut } from "react-icons/fi";

const API_BASE_URL = "https://shopnest-serveres.onrender.com";
const ROLE_LABELS = {
  admin: "Admin",
  customer: "Customer",
  a: "Group A",
  b: "Group B",
  c: "Group C",
  d: "Group D",
  e: "Group E",
};
const ROLE_STYLES = {
  admin: "bg-orange-100 text-orange-600",
  customer: "bg-peachpuff text-orange-700",
  a: "bg-amber-100 text-amber-600",
  b: "bg-orange-200 text-orange-700",
  c: "bg-orange-300 text-orange-800",
  d: "bg-orange-400 text-white",
  e: "bg-yellow-100 text-orange-600",
};

const CustomerGrid = ({ user, logout }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/customer?email=${user.email}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setCustomer(data[0]);
        } else if (data && data.email) {
          setCustomer(data);
        } else {
          toast.error("No customer data found for your account.");
          setCustomer(null);
        }
      } catch (err) {
        toast.error("Failed to load your profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [user]);

  if (loading)
    return (
      <div className="py-10 text-center text-[#CC5500] font-medium animate-pulse">
        Loading your profile...
      </div>
    );

  if (!customer)
    return (
      <div className="py-10 text-center text-gray-500">
        No customer information found.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300 p-8 relative overflow-hidden">
        {/* Decorative Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-white opacity-60 pointer-events-none"></div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={
                customer.photo ||
                user.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={customer.name || user.displayName || "User"}
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-200 shadow-md"
            />
            <span
              className={`absolute bottom-0 right-0 px-3 py-1 text-xs font-medium rounded-full ${ROLE_STYLES[customer.role]}`}
            >
              {ROLE_LABELS[customer.role] || "Customer"}
            </span>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              {customer.name || user.displayName || "Unnamed User"}
            </h2>
            <p className="text-gray-500 mb-2">{customer.email || user.email}</p>
            {customer.city && (
              <p className="text-gray-600 text-sm">
                📍 {customer.city}, {customer.country || "N/A"}
              </p>
            )}
            {customer.phone && (
              <p className="text-gray-600 text-sm mt-1">
                📞 {customer.phone}
              </p>
            )}
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              {customer.bio ||
                "This user hasn’t added a bio yet. Edit your profile to share more about yourself."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => toast(`Edit profile: ${customer.name}`)}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-sm transition"
            >
              <FiEdit /> Edit
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg shadow-sm transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerGrid;
