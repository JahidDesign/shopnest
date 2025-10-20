// File: Home.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import ProductsGrid from "./products/ProductsGrid";
import CategoryGrid from "./products/CategoryGrid";
import FeaturedProducts from "./products/FeaturedProducts";
import SunglassGrid from "./products/SunglassGrid";
import MotionSkeleton from "../components/MotionSkeleton";
import ModernHeroSlider from "./HomeHero";
import Newsletter from "./Newsletter";
import HomeBannerSlider from "./HomeBannerSlider";
import  ReviewsCarouselModern from "./ReviewsCarouselModern";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" },
  }),
};

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <MotionSkeleton />;
  }

  return (
    <div className="bg-white text-gray-900">
      {/* SEO Meta */}
      <Helmet>
        <html lang="en" />
        <title>ShopNest | Smart Online Shopping in Bangladesh</title>
        <meta
          name="description"
          content="ShopNest Bangladesh – Smart online shopping for electronics, groceries, fashion, and lifestyle essentials. Enjoy fast delivery, hot deals, and new arrivals."
        />
        <meta
          name="keywords"
          content="ecommerce, online shopping, Bangladesh, BD ecommerce, buy online BD, ShopNest, best online shop BD, grocery BD, fashion BD, electronics BD, smart shopping BD"
        />
        <meta name="author" content="ShopNest Bangladesh" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://shopnest.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="ShopNest – Smart Online Shopping BD" />
        <meta property="og:description" content="Shop smart with Bangladesh’s trusted online marketplace for gadgets, groceries, fashion, and lifestyle products." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://shopnest.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShopNest – Online Shopping Bangladesh" />
        <meta name="twitter:description" content="Discover smart deals, latest arrivals, and top products for online shopping in Bangladesh with ShopNest." />
      </Helmet>

      {/* Hero */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <ModernHeroSlider />
      </motion.div>
      {/* CategoryGrid */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <CategoryGrid />
      </motion.div>
      {/* Product */}
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <ProductsGrid />
      </motion.div>
      {/* HomeBannerSlider */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <HomeBannerSlider />
      </motion.div>
      {/* Feature Products */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <FeaturedProducts />
      </motion.div>
      {/* Sunglass Products */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <SunglassGrid />
      </motion.div>
      {/* ReviewsCarouselModern */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <ReviewsCarouselModern />
      </motion.div>
      {/* Newsletter */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <Newsletter />
      </motion.div>
     
    </div>
  );
};

export default Home;
