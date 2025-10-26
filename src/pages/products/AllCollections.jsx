// src/components/ProductsGrid.jsx
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

// 🔸 Generic Product Card Grid Component
const ProductCardGrid = ({ title, apiUrl, Icon }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // logged-in user

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [apiUrl]);

  // View single product
  const handleView = (product) => navigate(`/product/${product._id}`, { state: { product } });

  // Add to Cart
  const handleAddToCart = (product) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to add products to your cart.",
        confirmButtonColor: "#FF6600",
      });
      return;
    }

    const cartKey = `cart_${user.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const exists = cart.some((item) => item._id === product._id);

    if (exists) {
      Swal.fire({
        icon: "info",
        title: "Already in Cart",
        text: `${product.name} is already in your cart.`,
        confirmButtonColor: "#FF6600",
      });
      return;
    }

    const productWithUser = { ...product, userEmail: user.email };
    localStorage.setItem(cartKey, JSON.stringify([...cart, productWithUser]));

    Swal.fire({
      title: "Added to Cart!",
      html: `<strong>${product.name}</strong> added successfully.`,
      imageUrl: product.images?.[0] || "/placeholder.png",
      imageWidth: 120,
      imageHeight: 120,
      showCancelButton: true,
      confirmButtonText: "View Cart",
      cancelButtonText: "Continue Shopping",
      confirmButtonColor: "#FF6600",
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
    }).then((result) => {
      if (result.isConfirmed) navigate("/cart");
    });
  };

  return (
    <section className="w-full relative overflow-hidden py-16 sm:py-20">
      {/* Animated background orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-orange-500/15 to-rose-400/15 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-16">
        {/* Section Header */}
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
              />
            </div>
          </div>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            Discover our curated selection of premium products
          </p>
        </motion.div>

        {/* Product Grid */}
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
                <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-none overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-200/40 transition-all duration-500">
                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-rose-500 rounded-full blur opacity-75"></div>
                      <div className="relative bg-gradient-to-br from-orange-500 to-rose-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                        -{discountPercent}%
                      </div>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="relative h-72 sm:h-80 overflow-hidden bg-gradient-to-br from-slate-100 to-orange-50">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-center">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-5 space-y-3">
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
                      <span className="text-sm text-slate-600 font-medium">{p.rating || 4.5}</span>
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

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
  {/* View Details - Modern Glassy Button */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex-1 py-3 sm:py-4 px-6 bg-white/80 backdrop-blur-md hover:bg-white/90 text-slate-800 font-semibold rounded-none border border-slate-200 hover:border-slate-300 shadow-md hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
    onClick={() => handleView(p)}
  >
    Buy Now
  </motion.button>

  {/* Add to Cart - Animated Gradient Button */}
  <motion.button
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.97 }}
    className="flex-1 py-3 sm:py-4 px-6 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 hover:from-orange-600 hover:via-amber-400 hover:to-orange-500 text-white font-semibold rounded-none shadow-lg hover:shadow-2xl transition-all duration-500 text-base sm:text-lg relative overflow-hidden"
    onClick={() => handleAddToCart(p)}
  >
    {/* Gradient Hover Animation */}
    <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 hover:opacity-30 rounded-none transition-opacity duration-500 pointer-events-none"></span>
    AddCart
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

// 🔸 Icons
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
      <ProductCardGrid title="Gadget Collections" apiUrl="https://shopnest-ecom.onrender.com/products" Icon={GadgetIcon} />
      <ProductCardGrid title="Sunglass Collections" apiUrl="https://shopnest-ecom.onrender.com/sunglasses" Icon={SunglassIcon} />
      <ProductCardGrid title="Clothing Collections" apiUrl="https://shopnest-ecom.onrender.com/featureProducts" Icon={ClothingIcon} />
      <ProductCardGrid title="Beauty Collections" apiUrl="https://shopnest-ecom.onrender.com/makeUp" Icon={BeautyIcon} />
      <ProductCardGrid title="Camera Collections" apiUrl="https://shopnest-ecom.onrender.com/cameras" Icon={CameraIcon} />
      <ProductCardGrid title="Toys Collections" apiUrl="https://shopnest-ecom.onrender.com/chilldsToy" Icon={ToyIcon} />
    </div>
  );
};

export default ProductsAllCollections;
