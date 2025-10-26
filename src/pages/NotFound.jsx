// File: src/pages/NotFound.jsx
import React, { useState } from "react";
import { Home, ArrowLeft, RefreshCw, Search, ShoppingBag } from "lucide-react";

const NotFound = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
    }
  };

  const goBack = () => window.history.back();
  const goHome = () => (window.location.href = "/");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
      {/* Logo / Branding */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-md">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800">ShopNest</h1>
      </div>

      {/* Error Code */}
      <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
        404
      </h1>

      {/* Message */}
      <h2 className="text-2xl font-bold mb-2">Oops! Page not found</h2>
      <p className="text-gray-500 text-center max-w-md mb-8">
        The page you’re looking for doesn’t exist or has been moved. Try searching for what you need or head back to the homepage.
      </p>

      {/* Search box */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full max-w-md mb-8 border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products, categories..."
          className="flex-grow px-4 py-3 outline-none text-gray-700"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-3 hover:opacity-90 transition-all duration-300"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={goHome}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-md hover:opacity-90 transition-all"
        >
          <Home className="w-5 h-5" />
          Go Home
        </button>

        <button
          onClick={goBack}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:bg-gray-200 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl shadow-sm hover:bg-gray-200 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-400 mt-10">
        © {new Date().getFullYear()} <span className="font-semibold text-blue-600">ShopNest</span> — Smart Shopping Made Simple.
      </p>
    </div>
  );
};

export default NotFound;
