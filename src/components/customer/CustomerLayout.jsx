// File: src/components/layouts/CustomLayout.jsx
import Sidebar from "./CustomerSidebar";
import CustomerNavbar from "./CustomerNavbar";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CustomLayout = () => {
  return (
    <div className="flex bg-gray-50 text-gray-900 min-h-screen">
      {/* Global Helmet */}
      <Helmet>
        <title>Dashboard | ShopNest eCommerce</title>
        <meta
          name="description"
          content="ShopNest eCommerce dashboard for managing orders, payments, and products."
        />
        <meta
          name="keywords"
          content="shopnest, ecommerce, dashboard, online shop, order management"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Helmet>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-white shadow-lg border-r border-gray-200 z-40">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72 flex flex-col">
        {/* Navbar */}
        <header className="fixed top-0 left-72 right-0 z-30 bg-white shadow-md">
          <CustomerNavbar />
        </header>

        {/* Page Content */}
        <main className="flex-1 pt-20 p-6 bg-gray-100 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ShopNest eCommerce — All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

export default CustomLayout;
