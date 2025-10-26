// src/pages/ProductDetails.jsx
import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Clock,
  Package
} from "lucide-react";

const ProductDetails = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const product = location.state?.product;
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-orange-400" />
          </div>
          <p className="text-xl text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] || "/placeholder.png"
  );

  const handleAddToCart = () => {
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to add items to your cart",
        icon: "warning",
        confirmButtonColor: "#FF6600",
      });
      return;
    }

    const cartItem = {
      productId: product._id?.toString() || "N/A",
      productName: product.name || "Unnamed Product",
      productImage: selectedImage,
      quantity,
      price: product.price,
      buyerEmail: user.email,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    Swal.fire({
      title: "Added to Cart!",
      text: `${cartItem.productName} added successfully.`,
      icon: "success",
      confirmButtonColor: "#FF6600",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleBuyNow = async () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please log in to continue with payment",
        icon: "warning",
        confirmButtonColor: "#FF6600",
      });
      return;
    }

    const orderData = {
      amount: product.discountPrice || product.price,
      product_title: product.name,
      product_type: product.category,
      quantity,
      customer_name: user.displayName || "Customer",
      customer_email: user.email,
      delivery_info: "Delivery within 7 days via RedX Rider",
    };

    try {
      const res = await fetch("https://shopnest-ecom.onrender.com/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (data.ssl_redirect_url) {
        window.location.href = data.ssl_redirect_url;
      } else {
        Swal.fire("Error", "Failed to initiate payment", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const calculateDiscount = () => {
    if (product.hasDiscount && product.discountPrice && product.price) {
      const discount = ((product.price - product.discountPrice) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discountPercent = calculateDiscount();
  const finalPrice = product.discountPrice || product.price || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Product Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left - Images */}
            <div className="p-6 lg:p-10 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="sticky top-6">
                <div className="relative group mb-6">
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-xl"
                  />
                  {discountPercent > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden ${
                        selectedImage === img ? "ring-4 ring-orange-500" : "ring-2 ring-gray-200"
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Info */}
            <div className="p-6 lg:p-10 flex flex-col">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                ))}
                <span className="text-gray-600 text-sm">(4.8) 256 reviews</span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-5xl font-bold text-orange-600">৳{finalPrice}</div>
                {product.hasDiscount && (
                  <div className="text-2xl text-gray-400 line-through">৳{product.price}</div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-orange-100 rounded-lg font-bold text-lg"
                >
                  -
                </button>
                <span className="text-lg font-bold text-orange-600">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 bg-orange-100 rounded-lg font-bold text-lg"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 mb-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition"
              >
                Buy Now (Pay with SSLCommerz)
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Delivery + Payment Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4">
            <Truck className="w-8 h-8 text-orange-600" />
            <div>
              <h3 className="font-bold text-gray-900">RedX Delivery</h3>
              <p className="text-gray-600 text-sm">Delivered within 7 days nationwide.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-bold text-gray-900">100% Secure Payment</h3>
              <p className="text-gray-600 text-sm">Powered by SSLCOMMERZ Gateway.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-start gap-4">
            <Clock className="w-8 h-8 text-amber-600" />
            <div>
              <h3 className="font-bold text-gray-900">Easy Returns</h3>
              <p className="text-gray-600 text-sm">Return within 7 days after delivery.</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white mt-10 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-600" /> Delivery & Return Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Orders are delivered by <strong>RedX Rider</strong> within 7 business days anywhere in
            Bangladesh. You’ll receive SMS and email notifications. Products can be returned or
            exchanged within 7 days if damaged, defective, or incorrect.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
