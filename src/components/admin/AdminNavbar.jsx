// File: src/layouts/AdminNavbar.jsx
import React, { useState, useContext, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaFileAlt, FaMoneyBill, FaChevronDown, FaEye, FaCog, FaClipboardList, FaUserCheck, FaEnvelope, FaStar, FaBars, FaSignOutAlt, FaBell, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

const NotificationsDropdown = ({ notifications, onClose }) => {
  const unreadCount = notifications.filter((n) => n.unread).length;
  return (
    <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ type: "spring", damping: 20 }} className="absolute right-0 top-12 sm:top-14 w-[calc(100vw-2rem)] sm:w-80 md:w-96 max-w-md bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden z-50">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
        <div><h3 className="font-bold text-base sm:text-lg">Notifications</h3><p className="text-xs text-orange-100">{unreadCount} new updates</p></div>
        <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-white/20 rounded-full transition-colors"><FaTimes className="w-3 h-3 sm:w-4 sm:h-4" /></button>
      </div>
      <div className="max-h-64 sm:max-h-80 overflow-y-auto">
        {notifications.map((n, index) => (
          <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className={`px-4 sm:px-6 py-3 sm:py-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 ${n.unread ? "bg-orange-50/50 border-l-4 border-l-orange-500" : ""}`}>
            <div className="flex items-start gap-2 sm:gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 ${n.unread ? "bg-orange-500" : "bg-gray-300"}`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-800 font-medium">{n.text}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 flex items-center gap-1">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>{n.time}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 border-t border-gray-100">
        <button className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors" onClick={onClose}>View all notifications →</button>
      </div>
    </motion.div>
  );
};

const ProfileDropdown = ({ user, logout }) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ type: "spring", damping: 20 }} className="absolute right-0 top-12 sm:top-14 w-[calc(100vw-2rem)] sm:w-72 max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden z-50">
      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center gap-3 sm:gap-4">
        <div className="relative flex-shrink-0">
          <img src={user?.photoURL || "/default-avatar.png"} alt="Admin" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover border-2 border-white/30 shadow-lg" />
          <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base sm:text-lg truncate">{user?.displayName || user?.name}</p>
          <p className="text-xs text-orange-100 truncate">{user?.email}</p>
        </div>
      </div>
      <div className="py-1 sm:py-2">
        <button onClick={() => navigate("/admin/profile")} className="flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-orange-50 transition-all group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors"><FaUserCheck className="text-orange-600 text-sm sm:text-base" /></div>
          <div className="text-left flex-1"><p className="font-semibold text-xs sm:text-sm">My Profile</p><p className="text-[10px] sm:text-xs text-gray-500">View and edit profile</p></div>
        </button>
        <button onClick={() => navigate("/admin/settings")} className="flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-orange-50 transition-all group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors"><FaCog className="text-blue-600 text-sm sm:text-base" /></div>
          <div className="text-left flex-1"><p className="font-semibold text-xs sm:text-sm">Settings</p><p className="text-[10px] sm:text-xs text-gray-500">Preferences & configuration</p></div>
        </button>
        <hr className="my-1 sm:my-2 border-gray-100" />
        <button onClick={logout} className="flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-all group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors"><FaSignOutAlt className="text-red-600 text-sm sm:text-base" /></div>
          <div className="text-left flex-1"><p className="font-semibold text-xs sm:text-sm">Sign Out</p><p className="text-[10px] sm:text-xs text-red-400">Logout from dashboard</p></div>
        </button>
      </div>
    </motion.div>
  );
};

const Sidebar = ({ user, isCollapsed, isDrawerOpen, toggleDrawer }) => {
  const { pathname } = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const toggleMenu = (path) => setOpenMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  const navLinks = useMemo(() => [
    { name: "Dashboard", path: "/admin", icon: FaHome, color: "from-orange-500 to-amber-500", subLinks: [], roles: ["admin", "agent"] },
    { name: "Featured Products", path: "/admin/products-feature", icon: FaClipboardList, color: "from-purple-500 to-pink-500", subLinks: [{ name: "Add Feature", path: "/admin/products-feature/add" }, { name: "Edit Feature", path: "/admin/products-feature/edit" }], roles: ["admin", "agent"] },
    { name: "Products Section", path: "/admin/products-section", icon: FaFileAlt, color: "from-blue-500 to-cyan-500", subLinks: [{ name: "Add Products", path: "/admin/products-section/add" }, { name: "Edit Products", path: "/admin/products-section/edit" }], roles: ["admin", "agent"] },
    { name: "Hero Carousel", path: "/admin/hero-section", icon: FaFileAlt, color: "from-pink-500 to-rose-500", subLinks: [{ name: "Add Hero", path: "/admin/hero-section/add" }, { name: "Edit Hero", path: "/admin/hero-section/edit" }], roles: ["admin"] },
    { name: "Fashion Sunglass", path: "/admin/manage-users", icon: FaUsers, color: "from-green-500 to-emerald-500", subLinks: [{ name: "Add User", path: "/admin/manage-users/add" }, { name: "Edit User", path: "/admin/manage-users/edit" }], roles: ["admin"] },
    { name: "Transactions", path: "/admin/transactions", icon: FaMoneyBill, color: "from-yellow-500 to-orange-500", subLinks: [], roles: ["admin", "agent"] },
    { name: "Reviews Section", path: "/admin/reviews-section", icon: FaStar, color: "from-amber-500 to-yellow-500", subLinks: [{ name: "Add Review", path: "/admin/reviews-section/add" }, { name: "Edit Review", path: "/admin/reviews-section/edit" }], roles: ["admin", "agent"] },
    { name: "Camera Section", path: "/admin/manage-cam", icon: FaEnvelope, color: "from-indigo-500 to-purple-500", subLinks: [{ name: "Add Camera", path: "/admin/manage-cam/add" }, { name: "Edit Camera", path: "/admin/manage-cam/edit" }], roles: ["admin", "agent"] },
    { name: "Settings", path: "/admin/settings", icon: FaCog, color: "from-slate-500 to-gray-500", subLinks: [], roles: ["admin", "agent"] },
    { name: "View Pages", path: "/", icon: FaEye, color: "from-teal-500 to-cyan-500", subLinks: [], roles: ["admin", "agent"] },
  ], []);

  const isLinkActive = (path) => pathname === path || pathname.startsWith(path + "/");

  return (
    <>
      <AnimatePresence>{isDrawerOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={toggleDrawer} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" />}</AnimatePresence>
      <motion.aside initial={false} animate={{ width: isCollapsed ? 80 : 288 }} className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800 flex flex-col transition-transform duration-300 z-50 shadow-2xl ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 border-r border-gray-200/50`}>
        <div className="p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm flex items-center justify-between">
          {!isCollapsed ? <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-lg">S</div><div><h1 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">ShopNest</h1><p className="text-xs text-gray-500">Admin Dashboard</p></div></div> : <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg text-white font-bold text-lg">S</div>}
          <button onClick={toggleDrawer} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"><FaTimes /></button>
        </div>
        <nav className="p-3 flex-1 overflow-y-auto space-y-2 scrollbar-thin">
          {navLinks.filter(link => link.roles.includes(user?.role)).map(({ name, path, icon: Icon, subLinks = [], color }, index) => {
            const isActive = isLinkActive(path);
            const isOpen = openMenus[path] || subLinks.some(s => pathname === s.path);
            return (
              <motion.div key={name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="group relative">
                <Link to={path}>
                  <motion.button onClick={e => { if (subLinks.length) { e.preventDefault(); toggleMenu(path); } }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} title={isCollapsed ? name : ""} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive ? `bg-gradient-to-r ${color} text-white shadow-lg` : "text-gray-700 hover:bg-gray-100"}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"}`}><Icon className="text-base" /></div>
                    {!isCollapsed && <><span className="font-semibold text-sm flex-1 text-left truncate">{name}</span>{subLinks.length > 0 && <FaChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />}</>}
                  </motion.button>
                </Link>
                {!isCollapsed && subLinks.length > 0 && <AnimatePresence>{isOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="ml-12 mt-2 space-y-1 border-l-2 border-gray-200 pl-3">{subLinks.map((sub, subIndex) => <motion.div key={sub.path} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: subIndex * 0.05 }}><Link to={sub.path} className={`block text-sm px-4 py-2 rounded-xl transition-all duration-300 ${pathname === sub.path ? `bg-gradient-to-r ${color} shadow-md text-white font-semibold` : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}`}>{sub.name}</Link></motion.div>)}</motion.div>}</AnimatePresence>}
              </motion.div>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm flex items-center gap-3">
          <img src={user?.photoURL || "/default-avatar.png"} alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover" />
          {!isCollapsed && <div className="min-w-0"><p className="font-semibold text-gray-800 text-sm truncate">{user?.displayName || "Admin"}</p><p className="text-xs text-gray-500 truncate">{user?.email}</p></div>}
        </div>
      </motion.aside>
    </>
  );
};

const AdminNavbar = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [{ id: 1, text: "New user registered", time: "2 min ago", unread: true }, { id: 2, text: "New order received", time: "1 hr ago", unread: true }, { id: 3, text: "Product stock low", time: "3 hr ago", unread: false }];
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar user={user} isCollapsed={isCollapsed} isDrawerOpen={isDrawerOpen} toggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors lg:hidden flex-shrink-0"><FaBars className="text-gray-700" /></button>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors hidden lg:block flex-shrink-0"><FaBars className="text-gray-700" /></button>
            <div className="min-w-0 flex-1"><h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">Admin Dashboard</h2><p className="text-xs text-gray-500 truncate">Welcome back, manage your store</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} className="relative p-3 rounded-2xl hover:bg-gray-100 transition-colors">
                <FaBell className="text-gray-700 text-lg" />
                {notifications.some(n => n.unread) && <span className="absolute top-2 right-2 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span></span>}
              </motion.button>
              <AnimatePresence>{showNotifications && <NotificationsDropdown notifications={notifications} onClose={() => setShowNotifications(false)} />}</AnimatePresence>
            </div>
            <div className="relative">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="flex items-center gap-3 p-1 pr-4 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="relative flex-shrink-0"><img src={user?.photoURL || "/default-avatar.png"} alt="Profile" className="w-10 h-10 rounded-xl object-cover border-2 border-gray-200" /><div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div></div>
                <div className="hidden md:block text-left min-w-0"><p className="text-sm font-semibold text-gray-800 truncate">{user?.displayName || user?.name}</p><p className="text-xs text-gray-500 truncate">Administrator</p></div>
              </motion.button>
              <AnimatePresence>{showProfile && <ProfileDropdown user={user} logout={logout} />}</AnimatePresence>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminNavbar;