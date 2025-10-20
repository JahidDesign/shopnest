import React from "react";
import { Helmet } from "react-helmet-async";

const Orders = () => {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>ShopNest Orders | Track Your Purchases Bangladesh</title>
        <meta name="description" content="View and track your past and current orders with ShopNest Bangladesh. Check order status, delivery, and history." />
        <meta name="keywords" content="ShopNest orders, track orders BD, online shopping Bangladesh, order history BD, delivery BD" />
        <link rel="canonical" href="https://shopnest.com/orders" />

        {/* Open Graph */}
        <meta property="og:title" content="ShopNest Orders – Online Shopping BD" />
        <meta property="og:description" content="Track your orders and delivery status on ShopNest Bangladesh." />
        <meta property="og:image" content="/og-orders.jpg" />
        <meta property="og:url" content="https://shopnest.com/orders" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShopNest Orders – Online Shopping Bangladesh" />
        <meta name="twitter:description" content="View your order history and delivery status with ShopNest Bangladesh." />
        <meta name="twitter:image" content="/og-orders.jpg" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        {/* Render orders list here */}
      </div>
    </>
  );
};

export default Orders;
