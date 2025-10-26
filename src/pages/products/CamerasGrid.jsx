// File: FeaturedProducts.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProductCards = ({ products, onView, onAddToCart }) => {
  return (
    <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-white via-[#FFDAB9]/10 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6600]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFA500]/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-left bg-gradient-to-r from-[#CC5500] via-[#FF6600] to-[#FF7F32] bg-clip-text text-transparent"
        >
          Cameras Collections
        </motion.h2>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "5rem" }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-1 bg-gradient-to-r from-[#FF6600] to-[#FFA500] rounded-full mb-12"
        ></motion.div>

        {/* ✅ Responsive Grid: 1 / 2 / 4 Columns */}
        <div className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((p, i) => {
            const hasDiscount = p.hasDiscount && p.discountPrice;
            const discountPercent = hasDiscount
              ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
              : 0;

            return (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white border border-[#FFDAB9]/30 rounded-none overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#FF6600]/60 hover:scale-[1.03] transition-all duration-300 flex flex-col relative group backdrop-blur-sm"
              >
                {/* 🏷️ Discount Badge */}
                {hasDiscount && (
                  <motion.span 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.08 + 0.3, type: "spring" }}
                    className="absolute top-3 left-3 bg-gradient-to-br from-[#FF6600] to-[#CC5500] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 border-2 border-white/20"
                  >
                    {discountPercent}% OFF
                  </motion.span>
                )}

                {/* 🖼️ Product Image */}
                {p.images && p.images.length > 0 ? (
                  <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden bg-gradient-to-br from-[#FFDAB9]/20 to-white">
                    <motion.img
                      src={p.images[0]}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-top transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FF6600]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="h-56 sm:h-64 md:h-72 w-full bg-gradient-to-br from-[#FFDAB9]/30 to-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No Image Available
                  </div>
                )}

                {/* 🧾 Product Info */}
                <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-white to-[#FFDAB9]/5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2 min-h-[3rem] group-hover:text-[#CC5500] transition-colors duration-300">
                    {p.name}
                  </h3>

                  {/* 💰 Price */}
                  <div className="mt-3 flex items-center gap-2">
                    {hasDiscount ? (
                      <>
                        <span className="text-[#FF6600] font-bold text-xl tracking-tight">
                          ৳{p.discountPrice}
                        </span>
                        <span className="text-gray-400 line-through text-sm">
                          ৳{p.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#CC5500] font-bold text-xl tracking-tight">
                        ৳{p.price}
                      </span>
                    )}
                  </div>

                  {/* ⭐ Rating */}
                  <div className="mt-3 flex items-center gap-1">
                    <div className="flex text-[#FFA500]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= (p.rating || 4) ? "text-[#FFA500]" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm ml-2 font-medium">
                      {p.rating || 4.5}
                    </span>
                  </div>

                  {/* 🔘 Buttons */}
                  <div className="mt-5 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onView(p._id)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-[#FFDAB9]/40 to-[#FFDAB9]/60 hover:from-[#FFDAB9]/60 hover:to-[#FFDAB9]/80 text-[#CC5500] font-semibold rounded-xl transition-all duration-300 border border-[#FF7F32]/20"
                    >
                      View
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onAddToCart(p)}
                      className="flex-1 py-2.5 bg-gradient-to-r from-[#FF6600] to-[#FF7F32] hover:from-[#CC5500] hover:to-[#FF6600] text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-xl"
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

const CamerasProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://shopnest-ecom.onrender.com/cameras");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleView = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (product) => {
    alert(`🛒 Added to cart: ${product.name}`);
  };

  return (
    <ProductCards
      products={products}
      onView={handleView}
      onAddToCart={handleAddToCart}
    />
  );
};

export default CamerasProducts;
