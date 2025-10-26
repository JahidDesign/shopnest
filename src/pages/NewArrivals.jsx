import React from "react";
import { Helmet } from "react-helmet-async";
import NewProductsGrid from "./products/NewProductsGrid";
const NewArrivals = () => {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>ShopNest New Arrivals | Latest Products in Bangladesh</title>
        <meta name="description" content="Check out the latest products in electronics, fashion, and groceries. ShopNest Bangladesh brings new arrivals every week." />
        <meta name="keywords" content="ShopNest new arrivals, latest products BD, online shopping Bangladesh, electronics BD, fashion BD, groceries BD" />
        <link rel="canonical" href="https://shopnest.com/new" />

        {/* Open Graph */}
        <meta property="og:title" content="ShopNest New Arrivals – Online Shopping BD" />
        <meta property="og:description" content="Discover the latest products and new arrivals in Bangladesh with ShopNest." />
        <meta property="og:image" content="/og-new.jpg" />
        <meta property="og:url" content="https://shopnest.com/new" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShopNest New Arrivals – Online Shopping BD" />
        <meta name="twitter:description" content="Latest products in electronics, fashion, and groceries in Bangladesh." />
        <meta name="twitter:image" content="/og-new.jpg" />
      </Helmet>

      <div className="mx-auto p-6">
       <NewProductsGrid/>
      </div>
    </>
  );
};

export default NewArrivals;
