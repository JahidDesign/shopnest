// src/components/ToursGridStyledFull.jsx
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

const API_URL = "https://shopnest-ecom.onrender.com/tours";

const ToursGrid = () => {
  const [tours, setTours] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const now = new Date();

  // Fetch tours and remove expired discounts
  const fetchTours = async () => {
    try {
      const res = await fetch(API_URL);
      let data = await res.json();

      // Remove expired discounts
      data = data.map((tour) => {
        if (tour.discountEnd && new Date(tour.discountEnd) <= now) {
          return { ...tour, discount: undefined, discountEnd: undefined };
        }
        return tour;
      });

      setTours(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tours");
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Add to Cart
  const addToCart = (tour) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to add tours to your cart.",
        confirmButtonColor: "#FF6600",
      });
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.some(
      (item) => item.id === tour._id && item.userEmail === user.email
    );

    if (exists) {
      Swal.fire({
        icon: "info",
        title: "Already in Cart",
        text: `${tour.title} is already in your cart.`,
        confirmButtonColor: "#FF6600",
      });
      return;
    }

    // Ensure expired discount is not saved to cart
    const now = new Date();
    const tourToCart =
      tour.discountEnd && new Date(tour.discountEnd) <= now
        ? { ...tour, discount: undefined, discountEnd: undefined }
        : tour;

    const tourWithUser = { ...tourToCart, userEmail: user.email };
    localStorage.setItem("cart", JSON.stringify([...cart, tourWithUser]));

    Swal.fire({
      title: "Added to Cart!",
      html: `<strong>${tour.title}</strong> added successfully.`,
      imageUrl: tour.images?.[0] || "/placeholder.png",
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

  // View Tour
  const handleView = (tour) => {
    navigate(`/tour/${tour._id}`, { state: { tour } });
  };

  return (
    <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-white via-[#FFDAB9]/10 to-white relative overflow-hidden">
      <Toaster position="top-right" />

      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6600]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FFA500]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-left bg-gradient-to-r from-[#CC5500] via-[#FF6600] to-[#FF7F32] bg-clip-text text-transparent"
        >
          Hot Tour Collections
        </motion.h2>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "5rem" }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="h-1 bg-gradient-to-r from-[#FF6600] to-[#FFA500] rounded-full mb-12"
        ></motion.div>

        <div className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {tours.map((tour, idx) => {
            const validDiscount =
              tour.discount && tour.discountEnd && new Date(tour.discountEnd) > now;
            const discountPercent = validDiscount
              ? Math.round(((tour.prices - tour.discount) / tour.prices) * 100)
              : 0;
            const displayPrice = validDiscount ? tour.discount : tour.prices;

            return (
              <motion.div
                key={tour._id || idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white border border-[#FFDAB9]/30 rounded-none overflow-hidden shadow-md hover:shadow-2xl hover:border-[#FF6600]/60 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full relative group"
              >
                {validDiscount && (
                  <span className="absolute top-3 left-3 bg-gradient-to-br from-[#FF6600] to-[#CC5500] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 border-2 border-white/20">
                    {discountPercent}% OFF
                  </span>
                )}

                <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gradient-to-br from-[#FFDAB9]/20 to-white">
                  {tour.images?.length ? (
                    <img
                      src={tour.images[0]}
                      alt={tour.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow bg-gradient-to-b from-white to-[#FFDAB9]/5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 line-clamp-2 group-hover:text-[#CC5500] transition-colors duration-300 min-h-[3rem]">
                      {tour.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2">
                      {validDiscount ? (
                        <>
                          <span className="text-[#FF6600] font-bold text-xl">
                            ${displayPrice}
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            ${tour.prices}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#CC5500] font-bold text-xl">
                          ${displayPrice}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-xs mt-1">
                      Categories: {tour.categories.join(", ")}
                    </p>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleView(tour)}
                      className="flex-1 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-all"
                    >
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addToCart(tour)}
                      className="flex-1 py-2 bg-gradient-to-r from-[#FF6600] to-[#FF7F32] text-white font-medium rounded-lg hover:from-[#CC5500] hover:to-[#FF6600] transition-all shadow-sm hover:shadow-md"
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

export default ToursGrid;
