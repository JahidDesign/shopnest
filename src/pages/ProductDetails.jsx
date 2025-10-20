// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const navigate = useNavigate();

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://shopnest-serveres.onrender.com/featureProducts/${id}`);
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images?.[0] || "");
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (product) {
      const fetchRelated = async () => {
        try {
          const res = await fetch(
            `https://shopnest-serveres.onrender.com/featureProducts?category=${product.category}`
          );
          const data = await res.json();
          setRelatedProducts(data.filter((p) => p._id !== product._id));
        } catch (err) {
          console.error("Error fetching related products:", err);
        }
      };
      fetchRelated();
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#CC5500] font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  const handleNavigateProduct = (prodId) => navigate(`/product/${prodId}`);
  const handleAddToCart = (prod) => alert(`🛒 Added to cart: ${prod.name}`);
  const handleBuyNow = (prod) => alert(`💳 Buying now: ${prod.name}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FFDAB9]/5 to-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-10">
        {/* Back link with icon */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#FF6600] hover:text-[#CC5500] font-semibold transition-colors group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Products</span>
          </Link>
        </motion.div>

        {/* Product details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 bg-white shadow-2xl rounded-3xl p-6 lg:p-10 border border-[#FFDAB9]/30"
        >
          {/* Images Section */}
          <div className="space-y-4">
            <motion.div
              className="relative w-full h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFDAB9]/20 to-white shadow-lg"
              layoutId={`product-image-${id}`}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImage}
                  src={mainImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Discount badge on main image */}
              {product.hasDiscount && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute top-4 right-4 bg-gradient-to-br from-[#FF6600] to-[#CC5500] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg border-2 border-white/30"
                >
                  {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </motion.div>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <motion.img
                    key={idx}
                    src={img}
                    alt={`${product.name}-${idx}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-xl cursor-pointer border-3 transition-all ${
                      mainImage === img
                        ? "border-[#FF6600] shadow-lg ring-2 ring-[#FF6600]/30"
                        : "border-[#FFDAB9]/50 hover:border-[#FF7F32]"
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Product Name */}
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#CC5500] to-[#FF6600] bg-clip-text text-transparent leading-tight"
              >
                {product.name}
              </motion.h1>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="flex text-[#FFA500] text-xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.span
                      key={star}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + star * 0.05 }}
                      className={star <= product.rating ? "text-[#FFA500]" : "text-gray-300"}
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.rating} / 5
                </span>
                <span className="text-gray-400 text-sm">(124 reviews)</span>
              </motion.div>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-baseline gap-3 py-4 px-6 bg-gradient-to-r from-[#FFDAB9]/20 to-[#FFDAB9]/10 rounded-2xl border border-[#FF7F32]/20"
              >
                {product.hasDiscount ? (
                  <>
                    <span className="text-4xl font-bold text-[#FF6600]">
                      ৳{product.discountPrice}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ৳{product.price}
                    </span>
                    <span className="ml-auto text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      You save ৳{product.price - product.discountPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-[#CC5500]">
                    ৳{product.price}
                  </span>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h3 className="text-lg font-semibold text-[#CC5500]">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </motion.div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h3 className="text-lg font-semibold text-[#CC5500]">Available Variants</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.variants.map((v, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedVariant(idx)}
                        className={`border-2 p-3 rounded-xl cursor-pointer transition-all ${
                          selectedVariant === idx
                            ? "border-[#FF6600] bg-gradient-to-br from-[#FFDAB9]/30 to-[#FFDAB9]/10 shadow-md"
                            : "border-[#FFDAB9]/50 hover:border-[#FF7F32] bg-white"
                        }`}
                      >
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Color:</span>
                            <span className="text-[#CC5500] font-semibold">{v.color}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Size:</span>
                            <span className="text-[#CC5500] font-semibold">{v.size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Price:</span>
                            <span className="text-[#FF6600] font-bold">৳{v.price}</span>
                          </div>
                          <div className="text-xs text-gray-500">Stock: {v.stock}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 pt-6 border-t border-[#FFDAB9]/30"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBuyNow(product)}
                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl text-lg"
              >
                💳 Buy Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddToCart(product)}
                className="flex-1 py-4 bg-gradient-to-r from-[#FF6600] to-[#FF7F32] hover:from-[#CC5500] hover:to-[#FF6600] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl text-lg"
              >
                🛒 Add to Cart
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#CC5500] to-[#FF6600] bg-clip-text text-transparent">
                Related Products
              </h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-[#FF6600] to-transparent rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp, idx) => {
                const hasDiscount = rp.hasDiscount && rp.discountPrice;
                const discountPercent = hasDiscount
                  ? Math.round(((rp.price - rp.discountPrice) / rp.price) * 100)
                  : 0;

                return (
                  <motion.div
                    key={rp._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + idx * 0.1 }}
                    className="bg-white border border-[#FFDAB9]/30 rounded-2xl shadow-lg hover:shadow-2xl hover:border-[#FF6600]/60 transition-all flex flex-col group"
                  >
                    <div className="relative w-full h-56 overflow-hidden rounded-t-2xl cursor-pointer bg-gradient-to-br from-[#FFDAB9]/20 to-white">
                      <motion.img
                        src={rp.images?.[0] || "/placeholder.jpg"}
                        alt={rp.name}
                        whileHover={{ scale: 1.1 }}
                        className="w-full h-full object-cover transition-transform duration-500"
                        onClick={() => handleNavigateProduct(rp._id)}
                      />
                      {hasDiscount && (
                        <span className="absolute top-3 left-3 bg-gradient-to-br from-[#FF6600] to-[#CC5500] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          -{discountPercent}%
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FF6600]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="flex flex-col justify-between flex-grow p-4 bg-gradient-to-b from-white to-[#FFDAB9]/5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#CC5500] transition-colors">
                        {rp.name}
                      </h3>
                      <div className="mb-3">
                        {hasDiscount ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-[#FF6600]">
                              ৳{rp.discountPrice}
                            </span>
                            <span className="text-sm line-through text-gray-400">
                              ৳{rp.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-[#CC5500]">
                            ৳{rp.price}
                          </span>
                        )}
                      </div>

                      {/* Related product buttons */}
                      <div className="flex gap-2 mt-auto">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNavigateProduct(rp._id)}
                          className="flex-1 py-2 bg-gradient-to-r from-[#FFDAB9]/40 to-[#FFDAB9]/60 hover:from-[#FFDAB9]/60 hover:to-[#FFDAB9]/80 text-[#CC5500] font-semibold rounded-lg transition-all border border-[#FF7F32]/20"
                        >
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAddToCart(rp)}
                          className="flex-1 py-2 bg-gradient-to-r from-[#FF6600] to-[#FF7F32] hover:from-[#CC5500] hover:to-[#FF6600] text-white font-semibold rounded-lg transition-all shadow-md"
                        >
                          Add
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;