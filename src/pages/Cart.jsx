// src/pages/Cart.jsx
import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ✅ Load cart for current user only
  useEffect(() => {
    const allCarts = JSON.parse(localStorage.getItem("cart")) || [];
    if (user?.email) {
      const filtered = allCarts.filter((item) => item.userEmail === user.email);
      setCart(filtered);
    } else {
      setCart([]);
    }
  }, [user]);

  // ✅ Remove single product from cart
  const handleRemove = (id) => {
    const allCarts = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = allCarts.filter(
      (item) => !(item.id === id && item.userEmail === user.email)
    );

    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated.filter((item) => item.userEmail === user.email));

    Swal.fire({
      icon: "info",
      title: "Removed from Cart",
      text: "The item has been removed.",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  // ✅ Buy Now per product
  const handleBuyNow = (product) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Please log in first",
        text: "You must be logged in to complete a purchase.",
        confirmButtonText: "OK",
        confirmButtonColor: "#FF6600",
      });
      return;
    }

    const checkoutData = {
      productName: product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0] || "/placeholder.png",
      userName: user.displayName || "Guest User",
      userEmail: user.email,
    };

    // Save checkout info temporarily
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    Swal.fire({
      title: "Proceed to Payment?",
      html: `
        <div style="text-align: left;">
          <strong>Product:</strong> ${checkoutData.productName}<br/>
          <strong>Price:</strong> ৳${checkoutData.price}<br/>
          <strong>User:</strong> ${checkoutData.userName}<br/>
          <strong>Email:</strong> ${checkoutData.userEmail}
        </div>
      `,
      imageUrl: checkoutData.image,
      imageWidth: 100,
      imageHeight: 100,
      showCancelButton: true,
      confirmButtonText: "Go to Payment",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#FF6600",
    }).then((result) => {
      if (result.isConfirmed) navigate("/payment");
    });
  };

  // ✅ Empty Cart State
  if (!cart.length) {
    return (
      <>
        <Helmet>
          <title>ShopNest Cart | Review & Checkout Products BD</title>
        </Helmet>
        <div className="py-20 text-center text-gray-600">
          <h2 className="text-2xl font-semibold">Your cart is empty 🛒</h2>
          <p className="text-gray-500 mt-2">Browse products and add some!</p>
        </div>
      </>
    );
  }

  // ✅ Cart Layout
  return (
    <>
      <Helmet>
        <title>ShopNest Cart | Review & Checkout Products BD</title>
      </Helmet>

      <section className="py-16 px-4 sm:px-6 md:px-10 lg:px-16 bg-gradient-to-br from-white via-[#FFDAB9]/10 to-white min-h-screen">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-left bg-gradient-to-r from-[#CC5500] via-[#FF6600] to-[#FF7F32] bg-clip-text text-transparent">
          My Cart ({cart.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.map((product, i) => (
            <motion.div
              key={product.id || i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-lg shadow-md border border-[#FFDAB9]/30 overflow-hidden flex flex-col"
            >
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="h-56 w-full object-cover"
              />
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    {product.discountPrice ? (
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
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="w-1/2 py-2.5 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="w-1/2 py-2.5 bg-gradient-to-r from-[#FF6600] to-[#FF7F32] text-white font-medium rounded-lg hover:from-[#CC5500] hover:to-[#FF6600] transition-all shadow-sm hover:shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Cart;
