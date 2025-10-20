// src/components/SunglassGrid.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SunglassGrid = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://shopnest-serveres.onrender.com/sunglasses");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleView = (product) => navigate(`/product/${product.id}`, { state: { product } });
  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
  };

  return (
    <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-white via-[#FFDAB9]/10 to-white relative overflow-hidden">
      {/* 🔆 Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6600]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFA500]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* 🔶 Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-left bg-gradient-to-r from-[#CC5500] via-[#FF6600] to-[#FF7F32] bg-clip-text text-transparent"
        >
           Sunglasses Collection
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "5rem" }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-1 bg-gradient-to-r from-[#FF6600] to-[#FFA500] rounded-full mb-12"
        ></motion.div>

        {/* 🧱 Product Grid */}
        <div className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => {
            const hasDiscount =
              product.discountPrice && product.discountPrice < product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : 0;

            return (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white border border-[#FFDAB9]/30 rounded-none overflow-hidden shadow-md hover:shadow-2xl hover:border-[#FF6600]/60 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full relative group"
              >
                {/* 🏷️ Discount Badge */}
                {hasDiscount && (
                  <span className="absolute top-3 left-3 bg-gradient-to-br from-[#FF6600] to-[#CC5500] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 border-2 border-white/20">
                    {discountPercent}% OFF
                  </span>
                )}

                {/* 🖼️ Product Image */}
                <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-br from-[#FFDAB9]/20 to-white">
                  {product.images?.length ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* 🧾 Product Info */}
                <div className="p-5 flex flex-col justify-between flex-grow bg-gradient-to-b from-white to-[#FFDAB9]/5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2 group-hover:text-[#CC5500] transition-colors duration-300 min-h-[3rem]">
                      {product.name}
                    </h3>

                    {/* 💰 Price */}
                    <div className="mt-3 flex items-center gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-[#FF6600] font-bold text-xl">
                            ৳{product.discountPrice}
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            ৳{product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#CC5500] font-bold text-xl">
                          ৳{product.price}
                        </span>
                      )}
                    </div>

                    {/* ⭐ Rating */}
                    <div className="mt-3 flex items-center gap-1">
                      <div className="flex text-[#FFA500]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= (product.rating || 4) ? "text-[#FFA500]" : "text-gray-300"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600 text-sm ml-2 font-medium">
                        {product.rating || 4.5}
                      </span>
                    </div>
                  </div>

                  {/* 🛒 Buttons */}
                  <div className="mt-5 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleView(product)}
                      className="w-1/2 py-2.5 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-all"
                    >
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleAddToCart(product)}
                      className="w-1/2 py-2.5 bg-gradient-to-r from-[#FF6600] to-[#FF7F32] text-white font-medium rounded-lg hover:from-[#CC5500] hover:to-[#FF6600] transition-all shadow-sm hover:shadow-md"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SunglassGrid;
