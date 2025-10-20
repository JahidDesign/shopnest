// File: src/components/admin/Sidebar.jsx
import { useState, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaFileAlt,
  FaMoneyBill,
  FaChevronDown,
  FaEye,
  FaCog,
  FaClipboardList,
  FaNewspaper,
  FaUserCheck,
  FaEnvelope,
  FaStar,
  FaBars,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);

  const [openMenus, setOpenMenus] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = (path) => {
    setOpenMenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const navLinks = useMemo(() => [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FaHome,
      color: "from-[#FF6600] to-[#FFA500]",
      subLinks: [],
      roles: ["admin", "agent"],
    },
    {
      name: " Featured Products",
      path: "/admin/products-feature",
      icon: FaClipboardList,
      color: "from-[#FF7F32] to-[#FFDAB9]",
      subLinks: [
        { name: "Add Feature", path: "/admin/products-feature/add" },
        { name: "Edit Festure", path: "/admin/products-feature/edit" },
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
      name: "Manage Users",
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
        { name: "Add News", path: "/admin/manage-toys/add" },
        { name: "Edit News", path: "/admin/manage-toys/edit" },
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
  ], [user?.role]);

  const isLinkActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar / Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-slate-900 text-white shadow-2xl flex flex-col transition-transform duration-300 z-50
          ${isCollapsed ? "w-20" : "w-72"}
          ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between gap-3">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF6600] to-[#FFA500] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  ShopNest
                </h1>
                <p className="text-xs text-slate-400">Management Dashboard</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors hidden lg:flex"
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-2 flex-1 overflow-y-auto space-y-1">
          {navLinks
            .filter(link => link.roles.includes(user?.role))
            .map(({ name, path, icon: Icon, subLinks, color }) => {
              const isActive = isLinkActive(path);
              const isOpen = openMenus[path] || subLinks.some(sub => pathname === sub.path);

              return (
                <div key={name} className="group relative">
                  <button
                    onClick={() => toggleMenu(path)}
                    aria-expanded={isOpen}
                    aria-controls={`submenu-${name}`}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                      isActive
                        ? `bg-gradient-to-r ${color} shadow-lg text-white`
                        : "hover:bg-slate-800/50 hover:shadow-md text-slate-300 hover:text-white"
                    }`}
                    title={isCollapsed ? name : ""}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive ? "bg-white/20 shadow-inner" : "bg-slate-700/50 group-hover:bg-slate-600/50"
                    }`}>
                      <Icon className="text-base" />
                    </div>
                    {!isCollapsed && <span className="font-medium text-sm">{name}</span>}
                    {!isCollapsed && subLinks.length > 0 && (
                      <FaChevronDown className={`ml-auto transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    )}
                  </button>

                  {/* Submenu */}
                  {!isCollapsed && subLinks.length > 0 && (
                    <div
                      id={`submenu-${name}`}
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-6 space-y-1 border-l-2 border-slate-700/50 pl-2">
                        {subLinks.map((sub, index) => (
                          <Link
                            key={sub.path}
                            to={sub.path}
                            className={`block text-sm px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                              pathname === sub.path
                                ? `bg-gradient-to-r ${color} shadow-md text-white`
                                : "text-slate-400 hover:text-white hover:bg-slate-800/40 hover:shadow-sm"
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 bg-gradient-to-t from-slate-900 to-transparent">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50 flex items-center gap-3 hover:bg-slate-700/60 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-[#FF6600] to-[#FFA500] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">👤</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-white">{user?.name || "Admin User"}</p>
                <p className="text-xs text-slate-400">{user?.status || "Online"}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Drawer Button */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="fixed top-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-lg shadow-lg lg:hidden"
      >
        <FaBars />
      </button>

      {/* Overlay for Mobile Drawer */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
