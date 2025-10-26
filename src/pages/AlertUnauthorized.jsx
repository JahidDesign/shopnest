// File: src/components/alerts/AlertUnauthorized.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AlertUnauthorized = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/"); // Redirect to home page
  };

  return (
    <div className="flex flex-col items-start gap-3 p-4 mb-6 border-l-4 border-red-500 bg-red-50 text-red-800 rounded-lg shadow-sm">
      <div className="flex items-start gap-3 w-full">
        <AlertTriangle className="w-6 h-6 mt-0.5 text-red-600" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-700">Access Denied</h3>
          <p className="text-sm text-red-600">
            This panel is only allowed for administrators. Customers are not authorized. Please contact the admin if you believe this is an error.
          </p>
        </div>
      </div>
      <button
        onClick={handleBackHome}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Back Home
      </button>
    </div>
  );
};

export default AlertUnauthorized;
