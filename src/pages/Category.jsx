import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import MenFashions from "./Category/MenFashions";
import WomenFashions from "./Category/WomenFashions";

const Category = () => {
  const { name } = useParams();

  // SEO: Generate dynamic title & description
  const pageTitle = name
    ? `${name.charAt(0).toUpperCase() + name.slice(1)} Fashion | YourStore`
    : "Category | YourStore";

  const pageDescription = name
    ? `Explore the latest ${name} fashion products, trending styles, and must-have items at YourStore.`
    : "Browse all categories of products available at YourStore.";

  // Render default content for main category
  const renderDefault = () => {
    if (!name) return <div>Select a category to view products.</div>;

    switch (name.toLowerCase()) {
      case "men":
        return <MenFashions />;
      case "women":
        return <WomenFashions />;
      default:
        return <div>Category not found.</div>;
    }
  };

  return (
    <div className="max-w-full mx-auto p-6">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Nested routes */}
      <Outlet />

      {/* Default content */}
      {renderDefault()}
    </div>
  );
};

export default Category;
