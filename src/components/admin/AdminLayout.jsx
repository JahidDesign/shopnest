// File: src/layouts/AdminLayout.jsx
import React, { useState, useContext, useMemo } from "react";
import { Link, Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaHome, FaUsers, FaFileAlt, FaMoneyBill, FaChevronDown, FaEye, FaCog,
  FaClipboardList, FaUserCheck, FaEnvelope, FaStar, FaBars, FaSignOutAlt,
  FaBell, FaTimes, FaNewspaper
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

/* ----------------------------- NOTIFICATIONS ----------------------------- */
const NotificationsDropdown = ({ notifications, onClose }) => {
  const unreadCount = notifications.filter((n) => n.unread).length;
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", damping: 20 }}
      className="absolute right-0 top-12 sm:top-14 w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
    >
      <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Notifications</h3>
          <p className="text-xs text-orange-100">{unreadCount} new updates</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`px-6 py-3 hover:bg-orange-50 border-b border-gray-100 cursor-pointer last:border-0 ${n.unread ? "bg-orange-50/50 border-l-4 border-l-orange-500" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${n.unread ? "bg-orange-500" : "bg-gray-300"}`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium">{n.text}</p>
                <p className="text-xs text-gray-500 mt-1">{n.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <button className="text-sm text-orange-600 hover:text-orange-700 font-semibold" onClick={onClose}>
          View all notifications →
        </button>
      </div>
    </motion.div>
  );
};

/* ------------------------------- PROFILE ------------------------------- */
const ProfileDropdown = ({ user, logout }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", damping: 20 }}
      className="absolute right-0 top-12 sm:top-14 w-[calc(100vw-2rem)] sm:w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
    >
      <div className="px-6 py-5 bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center gap-4">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Admin"
          className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
        />
        <div className="flex-1">
          <p className="font-bold text-lg truncate">{user?.displayName || user?.name}</p>
          <p className="text-xs text-orange-100 truncate">{user?.email}</p>
        </div>
      </div>
      <div className="py-2">
        <button
          onClick={() => navigate("/admin/profile")}
          className="flex items-center gap-4 w-full px-6 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-all"
        >
          <FaUserCheck className="text-orange-600" />
          <span>My Profile</span>
        </button>
        <button
          onClick={() => navigate("/admin/settings")}
          className="flex items-center gap-4 w-full px-6 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-all"
        >
          <FaCog className="text-blue-600" />
          <span>Settings</span>
        </button>
        <hr className="my-2 border-gray-100" />
        <button
          onClick={logout}
          className="flex items-center gap-4 w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-all"
        >
          <FaSignOutAlt className="text-red-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.div>
  );
};

/* ------------------------------- SIDEBAR ------------------------------- */
const Sidebar = ({ user, isCollapsed, isDrawerOpen, toggleDrawer }) => {
  const { pathname } = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const toggleMenu = (path) => setOpenMenus((prev) => ({ ...prev, [path]: !prev[path] }));

  const navLinks = useMemo(
    () => [
      {
        name: "Dashboard",
        path: "/admin",
        icon: FaHome,
        color: "from-[#FF6600] to-[#FFA500]",
        subLinks: [],
        roles: ["admin", "agent"],
      },
      {
        name: "Featured Products",
        path: "/admin/products-feature",
        icon: FaClipboardList,
        color: "from-[#FF7F32] to-[#FFDAB9]",
        subLinks: [
          { name: "Add Feature", path: "/admin/products-feature/add" },
          { name: "Edit Feature", path: "/admin/products-feature/edit" },
        ],
        roles: ["admin", "agent"],
      },
      {
        name: "Products Section",
        path: "/admin/products-section",
        icon: FaFileAlt,
        color: "from-[#CC5500] to-[#FF6600]",
        subLinks: [
          { name: "Add Products", path: "/admin/products-section/add" },
          { name: "Edit Products", path: "/admin/products-section/edit" },
        ],
        roles: ["admin", "agent"],
      },
      {
        name: "Carousel",
        path: "/admin/manage-policies",
        icon: FaFileAlt,
        color: "from-[#FF6600] to-[#FFA500]",
        subLinks: [
          { name: "Add Carousel", path: "/admin/manage-policies/add" },
          { name: "Edit Carousel", path: "/admin/manage-policies/edit" },
        ],
        roles: ["admin"],
      },
      {
        name: "Hero Carousel",
        path: "/admin/hero-section",
        icon: FaFileAlt,
        color: "from-[#FF6600] to-[#FFA500]",
        subLinks: [
          { name: "Add Hero", path: "/admin/hero-section/add" },
          { name: "Edit Hero", path: "/admin/hero-section/edit" },
        ],
        roles: ["admin"],
      },
      {
        name: "Fashion Sunglass",
        path: "/admin/manage-users",
        icon: FaUsers,
        color: "from-[#FF6600] to-[#FFA500]",
        subLinks: [
          { name: "Add User", path: "/admin/manage-users/add" },
          { name: "Edit User", path: "/admin/manage-users/edit" },
        ],
        roles: ["admin"],
      },
      {
        name: "Transactions",
        path: "/admin/transactions",
        icon: FaMoneyBill,
        color: "from-[#FF7F32] to-[#FFDAB9]",
        subLinks: [],
        roles: ["admin", "agent"],
      },
      {
        name: "Manage Beauty",
        path: "/admin/manage-makeup",
        icon: FaUserCheck,
        color: "from-[#FF6600] to-[#FFA500]",
        subLinks: [
          { name: "Add Beauty", path: "/admin/manage-makeup/add" },
          { name: "Edit Beauty", path: "/admin/manage-makeup/edit" },
        ],
        roles: ["admin", "agent"],
      },
      {
        name: "Manage Toys",
        path: "/admin/manage-toys",
        icon: FaNewspaper,
        color: "from-[#FF7F32] to-[#FFDAB9]",
        subLinks: [
          { name: "Add Toy", path: "/admin/manage-toys/add" },
          { name: "Edit Toy", path: "/admin/manage-toys/edit" },
        ],
        roles: ["admin", "agent"],
      },
      {
        name: "Reviews Section",
        path: "/admin/reviews-section",
        icon: FaStar,
        color: "from-[#FF6600] to-[#FFA500]",
        subLinks: [
          { name: "Add Review", path: "/admin/reviews-section/add" },
          { name: "Edit Review", path: "/admin/reviews-section/edit" },
        ],
        roles: ["admin", "agent"],
      },
      {
        name: "Camera Section",
        path: "/admin/manage-cam",
        icon: FaEnvelope,
        color: "from-[#FF6600] to-[#FFA500]",
        subLinks: [
          { name: "Add Camera", path: "/admin/manage-cam/add" },
          { name: "Edit Camera", path: "/admin/manage-cam/edit" },
        ],
        roles: ["admin", "agent"],
      },
      {
        name: "View Pages",
        path: "/",
        icon: FaEye,
        color: "from-[#FF7F32] to-[#FFDAB9]",
        subLinks: [],
        roles: ["admin", "agent"],
      },
      {
        name: "Settings",
        path: "/admin/settings",
        icon: FaCog,
        color: "from-[#FF6600] to-[#FFA500]",
        subLinks: [],
        roles: ["admin", "agent"],
      },
    ],
    []
  );

  const isLinkActive = (path) => pathname === path || pathname.startsWith(path + "/");

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 288 }}
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 flex flex-col transition-all duration-300 z-50 shadow-2xl ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 border-r border-gray-200/50`}
      >
        <div className="p-4 border-b border-gray-200/50 bg-white/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  ShopNest
                </h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            )}
          </div>
          <button onClick={toggleDrawer} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden">
            <FaTimes />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="p-3 flex-1 overflow-y-auto space-y-2">
          {navLinks
            .filter((l) => l.roles.includes(user?.role))
            .map(({ name, path, icon: Icon, subLinks = [], color }, i) => {
              const isActive = isLinkActive(path);
              const isOpen = openMenus[path];
              return (
                <motion.div key={name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={path}>
                    <motion.button
                      onClick={(e) => {
                        if (subLinks.length) {
                          e.preventDefault();
                          toggleMenu(path);
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${color} text-white shadow-lg`
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? "bg-white/20" : "bg-gray-100"}`}>
                        <Icon className="text-base" />
                      </div>
                      {!isCollapsed && <span className="font-semibold text-sm flex-1 text-left truncate">{name}</span>}
                      {!isCollapsed && subLinks.length > 0 && <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                    </motion.button>
                  </Link>

                  {/* Sub Links */}
                  {!isCollapsed && subLinks.length > 0 && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-12 mt-2 space-y-1 border-l-2 border-gray-200 pl-3"
                        >
                          {subLinks.map((sub) => (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              className={`block text-sm px-4 py-2 rounded-xl ${
                                pathname === sub.path
                                  ? `bg-gradient-to-r ${color} text-white font-semibold`
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              );
            })}
        </nav>

        {/* Bottom Profile */}
        <div className="p-3 border-t border-gray-200/50 bg-white/50 flex items-center gap-3">
          <img src={user?.photoURL || "/default-avatar.png"} alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover" />
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{user?.displayName || "Admin"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

/* ------------------------------ MAIN LAYOUT ------------------------------ */
const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "New user registered", time: "2 min ago", unread: true },
    { id: 2, text: "New order received", time: "1 hr ago", unread: true },
    { id: 3, text: "Product stock low", time: "3 hr ago", unread: false },
  ];

  if (!user || !["admin", "agent"].includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | ShopNest</title>
        <meta name="description" content="Manage products, hero carousel, reviews, and orders from ShopNest Admin Dashboard." />
      </Helmet>

      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar user={user} isCollapsed={isCollapsed} isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />

        <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
          <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
            <div className="flex items-center gap-4 flex-1">
              <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="p-2 rounded-xl hover:bg-gray-100 lg:hidden">
                <FaBars className="text-gray-700" />
              </button>
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-xl hover:bg-gray-100 hidden lg:block">
                <FaBars className="text-gray-700" />
              </button>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h2>
                <p className="text-xs text-gray-500">Welcome back, manage your store</p>
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfile(false);
                  }}
                  className="relative p-3 rounded-2xl hover:bg-gray-100"
                >
                  <FaBell className="text-gray-700 text-lg" />
                  {notifications.some((n) => n.unread) && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                    </span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {showNotifications && <NotificationsDropdown notifications={notifications} onClose={() => setShowNotifications(false)} />}
                </AnimatePresence>
              </div>

              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-3 p-1 pr-4 rounded-2xl hover:bg-gray-100"
                >
                  <img
                    src={user?.photoURL || "/default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-xl object-cover border-2 border-gray-200"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-800">{user?.displayName || user?.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </motion.button>
                <AnimatePresence>{showProfile && <ProfileDropdown user={user} logout={logout} />}</AnimatePresence>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
