import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Shield, ChevronDown, Search, ShoppingCart, Heart, Package, MapPin, Phone, Mail } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const navConfig = {
  logo: { text: "ShopNest", url: "/", image: "/assets/logo.png" },
  links: [
    { name: "Home", url: "/" },
    { name: "All Products", url: "/products" },
    {
      name: "Categories",
      url: "/shop",
      dropdown: true,
      items: [
        { name: "Men's Fashion", url: "/category/men" },
        { name: "Women's Fashion", url: "/category/women"},
        { name: "Electronics", url: "/category/electronics" },
        { name: "Home & Living", url: "/category/home-living" },
        { name: "Beauty & Care", url: "/category/beauty" },
        { name: "Sports & Outdoor", url: "/category/sports" },
      ],
    },
    { name: "Deals", url: "/deals", badge: "Hot" },
    { name: "New Arrivals", url: "/new" },
    { name: "Contact", url: "/contact" },
  ],
};

const Navbar = () => {
  const { user, logout, cartItems } = useContext(AuthContext);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const displayName = user?.displayName || user?.name || user?.email?.split("@")[0] || "User";
  const photoURL = user?.photoURL || "/default-avatar.png";
  const userRole = user?.role || "customer";
  const isAdmin = userRole === "admin";
  const cartCount = cartItems?.length || 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search:", searchQuery);
      // Navigate to search results page
      // window.location.href = `/search?q=${searchQuery}`;
    }
  };

  return (
    <>
      {/* Top Bar - Contact Info */}
      <div className={`fixed top-0 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2 z-50 hidden md:block transition-all duration-500 ${
        scrolled ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-3 h-3" />
              +880  185000-7790
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-3 h-3" />
              support@shopnest.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              Free Shipping on Orders Over 2500 taka
            </span>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-20 md:h-28"></div>

      {/* Main Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "top-0 bg-white shadow-sm"
            : "top-0 md:top-8 bg-white shadow-sm"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to={navConfig.logo.url} className="flex items-center z-10">
              <div className="relative group">
                <img
                  src="shopNest.svg"
                  alt="ShopNest"
                  className="w-32 md:w-40 h-auto object-contain transition-all duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navConfig.links.map((link) =>
                link.dropdown ? (
                  <div key={link.name} className="relative" ref={categoryDropdownRef}>
                    <button
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-all duration-300 ${
                        categoryDropdownOpen
                          ? "text-orange-600 bg-orange-50"
                          : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                      }`}
                    >
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {categoryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Browse Categories</p>
                        </div>
                        {link.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.url}
                            onClick={() => setCategoryDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-200 group"
                          >
                            <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                            <span className="text-sm font-medium">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.url}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 relative ${
                      location.pathname === link.url
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    {link.name}
                    {link.badge && (
                      <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
            </div>

            {/* Right Section - Search, Icons, User */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search Bar - Desktop */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:block">
                <div className={`relative transition-all duration-300 ${searchFocused ? "w-80" : "w-64"}`}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm bg-gray-50 focus:bg-white"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </form>

              {/* Admin Panel - Desktop */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 text-sm font-medium"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-full hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-300 group"
              >
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </Link>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-300 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User Section - Desktop */}
              {user ? (
                <div className="hidden lg:block relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-4 rounded-full bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300 border-2 border-orange-200 hover:border-orange-300 group"
                  >
                    <img
                      src={photoURL}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-200"
                    />
                    <span className="text-sm font-medium text-gray-700 max-w-24 truncate">{displayName}</span>
                    <ChevronDown className={`w-4 h-4 text-orange-600 transition-transform duration-300 ${userDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-2xl py-2 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Card */}
                      <div className="px-4 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={photoURL}
                              alt="avatar"
                              className="w-14 h-14 rounded-xl object-cover border-2 border-orange-200 shadow-md"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{displayName}</div>
                            <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            <div className="mt-1">
                              <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                        >
                          <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm font-medium">My Profile</span>
                        </Link>

                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                        >
                          <Package className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm font-medium">Dashboard</span>
                        </Link>

                        <div className="my-2 border-t border-gray-100"></div>

                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 transition-all duration-200 group"
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden lg:block px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm font-semibold"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2.5 rounded-full bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 transition-all duration-300"
                onClick={() => setSideMenuOpen(true)}
              >
                <Menu className="w-5 h-5 text-orange-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Side Menu */}
      {sideMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
            onClick={() => setSideMenuOpen(false)}
          ></div>
          <div className="lg:hidden fixed right-0 top-0 w-80 h-full bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <img src="shopNest.svg" alt="shopNest" className="w-32 h-auto object-contain" />
                <button
                  onClick={() => setSideMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* User Info - Mobile */}
              {user && (
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <img
                      src={photoURL}
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-300 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{displayName}</div>
                      <div className="text-xs text-gray-600 truncate">{user.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Search */}
              <div className="p-4 border-b border-gray-200">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sm bg-gray-50"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </form>
              </div>

              {/* Mobile Menu Links */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-2">
                  {navConfig.links.map((link) =>
                    link.dropdown ? (
                      <div key={link.name} className="flex flex-col">
                        <div className="font-medium text-gray-900 px-4 py-3 rounded-lg bg-gray-50 flex items-center justify-between">
                          {link.name}
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex flex-col gap-1 mt-2 ml-4">
                          {link.items.map((item) => (
                            <Link
                              key={item.name}
                              to={item.url}
                              onClick={() => setSideMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                            >
                              <span className="text-lg">{item.icon}</span>
                              <span className="text-sm">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={link.name}
                        to={link.url}
                        onClick={() => setSideMenuOpen(false)}
                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 relative ${
                          location.pathname === link.url
                            ? "bg-orange-50 text-orange-600"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        {link.name}
                        {link.badge && (
                          <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    )
                  )}

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setSideMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium text-sm mt-2"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}

                  {user && (
                    <>
                      <div className="my-2 border-t border-gray-200"></div>
                      <Link
                        to="/profile"
                        onClick={() => setSideMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setSideMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                      >
                        <Package className="w-4 h-4" />
                        <span className="text-sm font-medium">Dashboard</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="p-4 border-t border-gray-200">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setSideMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setSideMenuOpen(false)}
                    className="block text-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;