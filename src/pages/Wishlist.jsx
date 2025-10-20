import React from "react";
import { Helmet } from "react-helmet-async";

const Wishlist = () => {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>ShopNest Wishlist | Save Your Favorite Products BD</title>
        <meta name="description" content="View your saved wishlist products at ShopNest Bangladesh. Keep track of electronics, fashion, groceries, and lifestyle items you love." />
        <meta name="keywords" content="ShopNest wishlist, saved products BD, online shopping Bangladesh, favorite items BD, electronics BD, fashion BD, groceries BD" />
        <link rel="canonical" href="https://shopnest.com/wishlist" />

        {/* Open Graph */}
        <meta property="og:title" content="ShopNest Wishlist – Online Shopping BD" />
        <meta property="og:description" content="Access and manage your saved favorite products on ShopNest Bangladesh." />
        <meta property="og:image" content="/og-wishlist.jpg" />
        <meta property="og:url" content="https://shopnest.com/wishlist" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShopNest Wishlist – Online Shopping Bangladesh" />
        <meta name="twitter:description" content="Check and manage your wishlist items on ShopNest Bangladesh." />
        <meta name="twitter:image" content="/og-wishlist.jpg" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        {/* Render wishlist items here */}
      </div>
    </>
  );
};

export default Wishlist;
