import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// ---------------- Public Pages ----------------
const Home = lazy(() => import("../pages/Home"));
const Products = lazy(() => import("../pages/Products"));
const Category = lazy(() => import("../pages/Category"));
const Deals = lazy(() => import("../pages/Deals"));
const NewArrivals = lazy(() => import("../pages/NewArrivals"));
const Contact = lazy(() => import("../pages/Contact"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/Profile"));
const Orders = lazy(() => import("../pages/Orders"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Cart = lazy(() => import("../pages/Cart"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const NotFound = lazy(() => import("../pages/NotFound"));
import ProductDetails from "../pages/ProductDetails";
import AllProductDetails from "../pages/AllProductDetails";
import TablesReviewsControl from "../pages/Reviews/TablesReviewsControl";
import AdminReviewsForm from "../pages/Reviews/AdminReviewsForm";
import AdminSunglass from "../pages/sunglass/AdminSunglass";
import AdminSunglassManage from "../pages/sunglass/AdminSunglassManage";
import AdminMakeUpTableManage from "../pages/makeUp/AdminMakeUpTableManage";
import AdminMakeUp from "../pages/makeUp/AdminMakeUp";
import AdminToysForm from "../pages/toys/AdminToysForm";
import AdminToysTableManage from "../pages/toys/AdminToysMamage";
import AdminCameras from "../pages/cameras/AdminCamerasForm";
import AdminCamerasManage from "../pages/cameras/AdminCamerasManage";

// ---------------- Admin Pages ----------------
const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const ManageProducts = lazy(() => import("../pages/admin/ManageProducts"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
const HeroManageSection = lazy(() => import("../pages/admin/ManageSection/HeroManageSection"));
const ProductsManageTable = lazy(() => import("../pages/admin/ManageSection/ProductsManageTable"));
const ProductsFormManage = lazy(() => import("../pages/admin/form/ProductsFormManage"));
const HeroSection = lazy(() => import("../pages/admin/form/HeroSection"));
const ManageOrders = lazy(() => import("../pages/admin/ManageOrders"));
const ManageCategories = lazy(() => import("../pages/admin/ManageCategories"));
const ManageCoupons = lazy(() => import("../pages/admin/ManageCoupons"));
const SiteSettings = lazy(() => import("../pages/admin/SiteSettings"));
const FeatureAdminForm = lazy(() => import("../pages/FeatureProducts/FeatureAdminForm"));
const FeatureAdminTable = lazy(() => import("../pages/FeatureProducts/FeatureAdminTable"));

function AppRoutes() {
  return (
    <Routes>
      {/* ---------------- Public Routes ---------------- */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/category/:name" element={<Category />} />
      <Route path="/deals" element={<Deals />} />
      <Route path="/new" element={<NewArrivals />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
      <Route path="/cart" element={<Cart />} />
       <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/product/:id" element={<AllProductDetails />} />

      {/* ---------------- Admin Routes ---------------- */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
         <Route path="hero-section/edit" element={<HeroManageSection />} />
        <Route path="hero-section/add" element={<HeroSection />} />
         <Route path="products-section/edit" element={<ProductsManageTable />} />
        <Route path="products-section/add" element={<ProductsFormManage />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="coupons" element={<ManageCoupons />} />
        <Route path="settings" element={<SiteSettings />} />
        <Route path="products-feature/edit" element={<FeatureAdminTable />} />
        <Route path="products-feature/add" element={<FeatureAdminForm />} />
        <Route path="reviews-section/edit" element={<TablesReviewsControl />} />
        <Route path="reviews-section/add" element={<AdminReviewsForm />} />

        <Route path="manage-users/edit" element={<AdminSunglassManage />} />
        <Route path="manage-users/add" element={<AdminSunglass />} />
        <Route path="manage-makeup/edit" element={<AdminMakeUpTableManage />} />
        <Route path="manage-makeup/add" element={<AdminMakeUp />} />
        <Route path="manage-toys/edit" element={<AdminToysTableManage />} />
        <Route path="manage-toys/add" element={<AdminToysForm />} />
        <Route path="manage-cam/edit" element={<AdminCamerasManage />} />
        <Route path="manage-cam/add" element={<AdminCameras />} />
      </Route>

      {/* ---------------- Not Found ---------------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
