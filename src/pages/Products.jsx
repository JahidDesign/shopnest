import React from "react";
import { Helmet } from "react-helmet-async";
import ProductsAllCollections from "./products/AllCollections";
import ProductSlider from "./ProductSlider";
const Products = () => {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>ShopNest Products | Buy Electronics, Fashion & More in Bangladesh</title>
        <meta name="description" content="Explore all products at ShopNest Bangladesh — electronics, fashion, home essentials, and more. Fast delivery across BD." />
        <meta name="keywords" content="ShopNest products, online shopping Bangladesh, electronics BD, fashion BD, home essentials BD, groceries BD" />
        <link rel="canonical" href="https://shopnest.com/products" />

        {/* Open Graph */}
        <meta property="og:title" content="ShopNest Products – Online Shopping BD" />
        <meta property="og:description" content="Browse our wide range of products — electronics, fashion, groceries, and lifestyle items across Bangladesh." />
        <meta property="og:image" content="/og-products.jpg" />
        <meta property="og:url" content="https://shopnest.com/products" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShopNest Products – Buy Online Bangladesh" />
        <meta name="twitter:description" content="Shop the latest electronics, fashion, and groceries online with ShopNest in Bangladesh." />
        <meta name="twitter:image" content="/og-products.jpg" />
      </Helmet>

      <div className="">
        <ProductSlider/>
        <ProductsAllCollections/>
      </div>
    </>
  );
};

export default Products;
