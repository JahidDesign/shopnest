import { useState, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaClipboardList,
  FaCog,
  FaBars,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaUserCircle,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const CustomerSidebar = () => {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Memoized navigation links
  const navLinks = useMemo(
    () => [
      { name: "Dashboard", path: "/dashboard", icon: FaHome },
      { name: "Reviews Section", path: "/dashboard/reviews", icon: FaFileAlt },
      { name: "My Orders", path: "/dashboard/my-orders", icon: FaClipboardList },
      { name: "Settings", path: "/dashboard/settings", icon: FaCog },
    ],
    []
  );

  const displayName =
    user?.displayName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Customer";

  const isLinkActive = (path) => pathname.startsWith(path);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-64"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-64"} 
        lg:translate-x-0 z-40 shadow-xl`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">Customer Panel</h1>
              <p className="text-xs text-slate-400">My Dashboard</p>
            </div>
          )}
          <button
            aria-label="Toggle sidebar"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          {navLinks.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors duration-200
                ${
                  isLinkActive(path)
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon className="text-lg" />
              {!isCollapsed && <span>{name}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-800 mt-auto">
            <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-2">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-3xl text-slate-400" />
              )}
              <div>
                <p className="text-sm font-semibold">{displayName}</p>
                <p className="text-xs text-slate-400">
                  {user?.status || "Active"}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Menu Button */}
      <button
        aria-label="Open sidebar"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="absolute top-4 left-4 z-50 lg:hidden bg-slate-900 text-white p-2 rounded-md shadow-md"
      >
        <FaBars />
      </button>
    </div>
  );
};

export default CustomerSidebar;
