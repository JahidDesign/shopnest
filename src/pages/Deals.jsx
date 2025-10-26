import React from "react";
import { Helmet } from "react-helmet-async";
import ToursGrid  from "./products/ToursGrid"
const Deals = () => {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>ShopNest Deals | Exclusive Discounts in Bangladesh</title>
        <meta name="description" content="Grab exclusive deals and discounts on electronics, fashion, and groceries in Bangladesh. ShopNest ensures fast delivery and savings." />
        <meta name="keywords" content="ShopNest deals, online shopping Bangladesh, discounts BD, electronics deals BD, fashion deals BD, grocery deals BD" />
        <link rel="canonical" href="https://shopnest.com/deals" />

        {/* Open Graph */}
        <meta property="og:title" content="ShopNest Deals – Online Shopping BD" />
        <meta property="og:description" content="Get the best online deals and discounts in Bangladesh with ShopNest." />
        <meta property="og:image" content="/og-deals.jpg" />
        <meta property="og:url" content="https://shopnest.com/deals" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShopNest Deals – Online Shopping Bangladesh" />
        <meta name="twitter:description" content="Exclusive deals on electronics, fashion, groceries, and lifestyle products across Bangladesh." />
        <meta name="twitter:image" content="/og-deals.jpg" />
      </Helmet>

      <div className="max-w-full mx-auto p-6">
       <ToursGrid/>
      </div>
    </>
  );
};

export default Deals;
