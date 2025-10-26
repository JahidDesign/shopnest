// File: src/components/CustomerNavbar.jsx
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ChevronDown, User, Settings, LogOut, ShoppingCart } from "lucide-react";

const CustomerNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayName =
    user?.displayName || user?.name || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL || user?.photo || "/default-avatar.png";

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-sm border-b border-gray-200">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/shopnest-logo.svg"
          alt="ShopNest Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h1 className="text-2xl font-bold text-orange-600 tracking-tight">
          ShopNest
        </h1>
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Cart Icon */}
        <Link
          to="/cart"
          className="relative text-gray-700 hover:text-orange-600 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </Link>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={photoURL}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-orange-500 shadow-sm"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="font-semibold text-gray-800">{displayName}</span>
              <span className="text-sm text-gray-500">{user?.email}</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-5 h-5 text-orange-600" /> My Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="w-5 h-5 text-orange-600" /> Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
