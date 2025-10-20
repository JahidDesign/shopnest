import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// 🔸 Common Product Grid Layout
const ProductCardGrid = ({ title, apiUrl, Icon }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Error loading products:", err));
  }, [apiUrl]);

  const handleView = (product) => navigate(`/product/${product._id}`);
  const handleAddToCart = (product) => navigate("/cart", { state: product });

  return (
    <section className="w-full relative overflow-hidden py-16 sm:py-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50"></div>
      
      {/* Floating orbs with blur */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"
      ></motion.div>
      
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-orange-500/15 to-rose-400/15 rounded-full blur-3xl"
      ></motion.div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
        {/* Modern Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25"
            >
              <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                {title}
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-transparent rounded-full mt-2"
              ></motion.div>
            </div>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            Discover our curated selection of premium products
          </p>
        </motion.div>

        {/* Glass morphism grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {products.map((p, i) => {
            const hasDiscount = p.discountPrice && p.discountPrice < p.price;
            const discountPercent = hasDiscount
              ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
              : 0;

            return (
              <motion.div
                key={p._id || i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Glass card */}
                <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-200/40 transition-all duration-500">
                  
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", delay: i * 0.05 + 0.3 }}
                      className="absolute top-4 left-4 z-20"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full blur opacity-75"></div>
                        <div className="relative bg-gradient-to-br from-orange-500 to-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                          -{discountPercent}%
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all duration-300 group/heart"
                  >
                    <svg className="w-5 h-5 text-slate-600 group-hover/heart:text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </motion.button>

                  {/* Product Image with overlay */}
                  <div className="relative h-72 sm:h-80 overflow-hidden bg-gradient-to-br from-slate-100 to-orange-50">
                    {p.images?.[0] ? (
                      <>
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-slate-400 text-center">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">No Image</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-5 space-y-3">
                    {/* Product Name */}
                    <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-600 transition-colors duration-300">
                      {p.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= (p.rating || 4)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-300 fill-slate-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-slate-600 font-medium">
                        {p.rating || 4.5}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({Math.floor(Math.random() * 200) + 50} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                            ৳{p.discountPrice?.toLocaleString()}
                          </span>
                          <span className="text-sm text-slate-400 line-through">
                            ৳{p.price?.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                          ৳{p.price?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleView(p)}
                        className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-300 border border-slate-200 hover:border-slate-300"
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToCart(p)}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300"
                      >
                        Add to Cart
                      </motion.button>
                    </div>
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

// 🔸 SVG Icons (unchanged)
const GadgetIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M8 20V4M16 20V4" />
  </svg>
);

const SunglassIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="7" cy="12" r="3" />
    <circle cx="17" cy="12" r="3" />
    <path d="M4 12H2m20 0h-2M10 12h4" />
  </svg>
);

const ClothingIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M8 4l4 2 4-2 4 2-2 14H6L4 6l4-2z" />
  </svg>
);

const BeautyIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 2v20M5 8h14M8 22h8" />
  </svg>
);

const CameraIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <circle cx="12" cy="14" r="4" />
    <path d="M9 4h6l1 3H8l1-3z" />
  </svg>
);

const ToyIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m14.95-7.05L16 6m-8 12-1.05 1.05M6 6l1.05 1.05m10.9 10.9L18 18" />
  </svg>
);

// 🔸 Main Component
const ProductsAllCollections = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <ProductCardGrid title="Gadget Collections" apiUrl="https://shopnest-serveres.onrender.com/products" Icon={GadgetIcon} />
      <ProductCardGrid title="Sunglass Collections" apiUrl="https://shopnest-serveres.onrender.com/sunglasses" Icon={SunglassIcon} />
      <ProductCardGrid title="Clothing Collections" apiUrl="https://shopnest-serveres.onrender.com/featureProducts" Icon={ClothingIcon} />
      <ProductCardGrid title="Beauty Collections" apiUrl="https://shopnest-serveres.onrender.com/makeUp" Icon={BeautyIcon} />
      <ProductCardGrid title="Camera Collections" apiUrl="https://shopnest-serveres.onrender.com/cameras" Icon={CameraIcon} />
      <ProductCardGrid title="Toys Collections" apiUrl="https://shopnest-serveres.onrender.com/chilldsToy" Icon={ToyIcon} />
    </div>
  );
};

export default ProductsAllCollections;