import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

// ---------------- Public Pages ----------------
const Home = lazy(() => import("../pages/Home"));
const Products = lazy(() => import("../pages/Products"));
const Category = lazy(() => import("../pages/Category"));
const MenFashions = lazy(() => import("../pages/Category/MenFashions"));
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
const AlertUnauthorized = lazy(() => import("../pages/AlertUnauthorized"));

// Additional Product Details
const ProductDetails = lazy(() => import("../pages/ProductDetails"));
const AllProductDetails = lazy(() => import("../pages/AllProductDetails"));

// ---------------- Admin Pages ----------------
const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));
const CustomLayout = lazy(() => import("../components/customer/CustomerLayout"));
const CustomerDashboard = lazy(() => import("../components/customer/CustomerDashboard"));
const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const HeroManageSection = lazy(() => import("../pages/admin/ManageSection/HeroManageSection"));
const ProductsManageTable = lazy(() => import("../pages/admin/ManageSection/ProductsManageTable"));
const ProductsFormManage = lazy(() => import("../pages/admin/form/ProductsFormManage"));
const HeroSection = lazy(() => import("../pages/admin/form/HeroSection"));
const SiteSettings = lazy(() => import("../pages/admin/SiteSettings"));
const FeatureAdminForm = lazy(() => import("../pages/FeatureProducts/FeatureAdminForm"));
const FeatureAdminTable = lazy(() => import("../pages/FeatureProducts/FeatureAdminTable"));
const MyPolicies = lazy(() => import("../pages/customer/MyPolicies"));

// Reviews
const TablesReviewsControl = lazy(() => import("../pages/Reviews/TablesReviewsControl"));
const AdminReviewsForm = lazy(() => import("../pages/Reviews/AdminReviewsForm"));

// Sunglass
const AdminSunglass = lazy(() => import("../pages/sunglass/AdminSunglass"));
const AdminSunglassManage = lazy(() => import("../pages/sunglass/AdminSunglassManage"));

// Makeup
const AdminMakeUpTableManage = lazy(() => import("../pages/makeUp/AdminMakeUpTableManage"));
const AdminMakeUp = lazy(() => import("../pages/makeUp/AdminMakeUp"));

// Toys
const AdminToysForm = lazy(() => import("../pages/toys/AdminToysForm"));
const AdminToysTableManage = lazy(() => import("../pages/toys/AdminToysMamage"));

// Cameras
const AdminCameras = lazy(() => import("../pages/cameras/AdminCamerasForm"));
const AdminCamerasManage = lazy(() => import("../pages/cameras/AdminCamerasManage"));

// Payment
const PaymentGateway = lazy(() => import("../pages/products/PaymentGateway"));

// ---------------- Suspense Loader ----------------
const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <span className="text-orange-500 font-bold text-xl animate-pulse">Loading...</span>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ---------------- Public Routes ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/category/:name" element={<Category />}>
          <Route path="men" element={<MenFashions />} />
        </Route>
        <Route path="/deals" element={<Deals />} />
        <Route path="/new" element={<NewArrivals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/unauthorized" element={<AlertUnauthorized />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/product/:id/details" element={<ProductDetails />} />
        <Route path="/product/:id/all" element={<AllProductDetails />} />
        <Route path="/payment" element={<PaymentGateway />} />

        {/* ---------------- Customer Routes ---------------- */}
        <Route path="/dashboard/*" element={
          <PrivateRoute allowedRoles={["customer"]}>
            <CustomLayout />
          </PrivateRoute>
        }>
          <Route index element={<CustomerDashboard />} />
          <Route path="my-orders" element={<MyPolicies />} />
          <Route path="reviews" element={<AdminReviewsForm />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>

        {/* ---------------- Admin Routes ---------------- */}
        <Route path="/admin/*" element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="hero-section/edit" element={<HeroManageSection />} />
          <Route path="hero-section/add" element={<HeroSection />} />
          <Route path="products-section/edit" element={<ProductsManageTable />} />
          <Route path="products-section/add" element={<ProductsFormManage />} />
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
    </Suspense>
  );
}

export default AppRoutes;
