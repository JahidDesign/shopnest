// File: pages/Cart.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const Cart = () => {
  const { state } = useLocation();
  const product = state;

  return (
    <>
      {/* ✅ SEO Metadata */}
      <Helmet>
        <html lang="en" />
        <title>ShopNest Cart | Review & Checkout Products BD</title>
        <meta
          name="description"
          content="Review your shopping cart items on ShopNest Bangladesh. Add, remove, and proceed to checkout for fast delivery across BD."
        />
        <meta
          name="keywords"
          content="ShopNest cart, online shopping Bangladesh, checkout BD, shopping cart BD, buy online Bangladesh"
        />
        <link rel="canonical" href="https://shopnest.com/cart" />

        {/* ✅ Open Graph */}
        <meta property="og:title" content="ShopNest Cart – Online Shopping BD" />
        <meta
          property="og:description"
          content="Review your cart and proceed to checkout with ShopNest Bangladesh."
        />
        <meta property="og:image" content="/og-cart.jpg" />
        <meta property="og:url" content="https://shopnest.com/cart" />
        <meta property="og:type" content="website" />

        {/* ✅ Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShopNest Cart – Online Shopping Bangladesh" />
        <meta
          name="twitter:description"
          content="Manage your cart items and checkout safely on ShopNest Bangladesh."
        />
        <meta name="twitter:image" content="/og-cart.jpg" />
      </Helmet>

      {/* ✅ Cart Content */}
      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-3xl font-bold text-[#FF6600] mb-8">🛒 Your Shopping Cart</h1>

        {product ? (
          <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-40 h-40 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="text-gray-700 mt-2">৳{product.price}</p>
              {product.description && (
                <p className="text-gray-500 text-sm mt-1">{product.description}</p>
              )}
              <button className="mt-4 bg-[#FF6600] hover:bg-[#e65c00] text-white px-5 py-2 rounded-lg transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No product added yet!</p>
        )}
      </div>
    </>
  );
};

export default Cart;
