import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const API_URL = "https://shopnest-ecom.onrender.com/categories";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading categories:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const renderLinkWrapper = (cat, children) => {
    if (cat.path) {
      // Internal route
      return (
        <Link to={cat.path} className="block">
          {children}
        </Link>
      );
    } else if (cat.url) {
      // External link
      return (
        <a
          href={cat.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {children}
        </a>
      );
    } else {
      // Fallback (no link)
      return <div className="block cursor-default">{children}</div>;
    }
  };

  return (
    <section className="relative min-h-screen py-20 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-[#FFDAB9]/5">
      {/* Animated background */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-[#FF6600]/10 to-[#FFA500]/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-[#FF7F32]/10 to-[#CC5500]/10 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="max-w-8xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
          >
            <span className="bg-gradient-to-r from-[#CC5500] via-[#FF6600] to-[#FFA500] bg-clip-text text-transparent">
              Categories
            </span>
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="h-1.5 mx-auto bg-gradient-to-r from-[#FF6600] via-[#FFA500] to-[#FF7F32] rounded-full"
          />
        </div>

        {/* Category Grid */}
        {Array.isArray(categories) && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id || index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredId(cat.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="group relative"
              >
                {renderLinkWrapper(
                  cat,
                  <div className="relative overflow-hidden bg-white shadow-lg rounded-xl transition-all duration-500 hover:shadow-2xl">
                    {/* Image */}
                    <div className="relative h-40 sm:h-48 md:h-56 lg:h-48 xl:h-48 overflow-hidden rounded-t-xl">
                      <motion.img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: hoveredId === cat.id ? 1.05 : 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                        initial={{ opacity: 0.6 }}
                        animate={{
                          opacity: hoveredId === cat.id ? 0.8 : 0.6,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative p-4 sm:p-5">
                      <motion.h3
                        className="text-sm sm:text-base font-bold text-[#CC5500] mb-1"
                        animate={{ x: hoveredId === cat.id ? 2 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {cat.title}
                      </motion.h3>

                      <motion.div
                        className="flex items-center text-[#FF6600] font-semibold text-sm sm:text-base"
                        animate={{ x: hoveredId === cat.id ? 4 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>Explore</span>
                        <motion.svg
                          className="w-4 h-4 sm:w-5 sm:h-5 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{
                            x: hoveredId === cat.id ? 2 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                            repeat:
                              hoveredId === cat.id ? Infinity : 0,
                            repeatType: "reverse",
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </motion.svg>
                      </motion.div>

                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#FF6600] to-[#FFA500]"
                        initial={{ width: 0 }}
                        animate={{
                          width: hoveredId === cat.id ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 mb-6 bg-gradient-to-br from-[#FF6600]/20 to-[#FFA500]/20 flex items-center justify-center rounded-full">
              <svg
                className="w-12 h-12 text-[#FF6600]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-xl text-gray-500 font-medium">
              No categories found
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Check back soon for new collections
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoryGrid;
