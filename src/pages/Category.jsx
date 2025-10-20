import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const Category = () => {
  const { name } = useParams();
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>ShopNest {capitalized} | Best {capitalized} in Bangladesh</title>
        <meta name="description" content={`Explore top ${capitalized} products online in Bangladesh. ShopNest offers best deals on ${capitalized}.`} />
        <meta name="keywords" content={`ShopNest ${capitalized}, ${capitalized} online Bangladesh, buy ${capitalized} BD, ${capitalized} deals BD`} />
        <link rel="canonical" href={`https://shopnest.com/category/${name}`} />

        {/* Open Graph */}
        <meta property="og:title" content={`ShopNest ${capitalized} – Online Shopping BD`} />
        <meta property="og:description" content={`Buy ${capitalized} products online in Bangladesh at ShopNest. Best deals and fast delivery.`} />
        <meta property="og:image" content={`/og-${name}.jpg`} />
        <meta property="og:url" content={`https://shopnest.com/category/${name}`} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`ShopNest ${capitalized} – Buy Online BD`} />
        <meta name="twitter:description" content={`Shop ${capitalized} online in Bangladesh with ShopNest. Fast delivery and best prices.`} />
        <meta name="twitter:image" content={`/og-${name}.jpg`} />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{capitalized}</h1>
        {/* Render category products here */}
      </div>
    </>
  );
};

export default Category;
