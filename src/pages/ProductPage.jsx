import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw, Check } from "lucide-react";

const ProductPage = () => {
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
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl"
        }
      });
      return;
    }

    const cartItem = {
      productId: product._id?.toString() || "N/A",
      productName: product.name || "Unnamed Product",
      productImage: selectedImage || product.images?.[0] || "/placeholder.png",
      category: product.category || "N/A",
      brand: product.brand || "N/A",
      description: product.description || "N/A",
      tags: product.tags || [],
      variants: product.variants || [],
      stock: product.stock || 0,
      orderPrice: product.price || 0,
      discountPrice: product.discountPrice || null,
      hasDiscount: product.hasDiscount || false,
      weight: product.weight || "N/A",
      dimensions: product.dimensions || "N/A",
      status: product.status || "N/A",
      featured: product.featured || false,
      discountStart: product.discountStart || null,
      discountEnd: product.discountEnd || null,
      buyerEmail: user.email || "N/A",
      buyerName: user.displayName || "Anonymous User",
      buyerId: user.uid || "N/A",
      buyerPhone: user.phoneNumber || "N/A",
      quantity: quantity,
      dateAdded: new Date().toLocaleString(),
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    Swal.fire({
      title: "Added to Cart!",
      text: `${cartItem.productName} has been added to your cart`,
      icon: "success",
      confirmButtonColor: "#FF6600",
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: "rounded-2xl"
      }
    });
  };

  const handleBuyNow = async () => {
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to complete your purchase",
        icon: "warning",
        confirmButtonColor: "#FF6600",
        customClass: {
          popup: "rounded-2xl"
        }
      });
      return;
    }

    const orderData = {
      productId: product._id?.toString() || "N/A",
      productName: product.name || "Unnamed Product",
      productImage: selectedImage || product.images?.[0] || "/placeholder.png",
      category: product.category || "N/A",
      brand: product.brand || "N/A",
      description: product.description || "N/A",
      tags: product.tags || [],
      variants: product.variants || [],
      stock: product.stock || 0,
      orderPrice: product.price || 0,
      discountPrice: product.discountPrice || null,
      hasDiscount: product.hasDiscount || false,
      weight: product.weight || "N/A",
      dimensions: product.dimensions || "N/A",
      status: product.status || "N/A",
      featured: product.featured || false,
      discountStart: product.discountStart || null,
      discountEnd: product.discountEnd || null,
      buyerEmail: user.email || "N/A",
      buyerName: user.displayName || "Anonymous User",
      buyerId: user.uid || "N/A",
      buyerPhone: user.phoneNumber || "N/A",
      quantity: quantity,
      date: new Date().toLocaleString(),
    };

    try {
      const res = await fetch("https://shopnest-serveres.onrender.com/electronics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        Swal.fire({
          title: "Purchase Successful!",
          text: "Your order has been placed successfully",
          icon: "success",
          confirmButtonColor: "#FF6600",
          customClass: {
            popup: "rounded-2xl"
          }
        });
      } else {
        const errorText = await res.text();
        Swal.fire({
          title: "Error",
          text: `Failed to place order: ${errorText}`,
          icon: "error",
          confirmButtonColor: "#ef4444",
          customClass: {
            popup: "rounded-2xl"
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Network error occurred",
        icon: "error",
        confirmButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-2xl"
        }
      });
      console.error(error);
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
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left - Image Gallery */}
            <div className="p-6 lg:p-10 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="sticky top-6">
                {/* Main Image */}
                <div className="relative group mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <img
                    src={selectedImage}
                    alt={product.name || "Product"}
                    className="w-full h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {discountPercent > 0 && (
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                        {discountPercent}% OFF
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-6 h-6 transition-all ${isWishlisted ? 'fill-orange-500 text-orange-500' : 'text-gray-600'}`} />
                  </button>
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                        selectedImage === img
                          ? "ring-4 ring-orange-500 scale-105 shadow-xl"
                          : "ring-2 ring-gray-200 hover:ring-orange-300 hover:scale-105"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Product Details */}
            <div className="p-6 lg:p-10 flex flex-col">
              {/* Header */}
              <div className="flex-1">
                {product.brand && (
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full mb-4 border border-orange-200">
                    <span className="text-sm font-semibold text-orange-600">{product.brand}</span>
                  </div>
                )}

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.name || "Unnamed Product"}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm font-medium">(4.8) 256 reviews</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6">
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                    ৳{finalPrice.toLocaleString()}
                  </div>
                  {product.hasDiscount && product.price && (
                    <div className="text-2xl text-gray-400 line-through">
                      ৳{product.price.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-6 p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Stock & Category */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="text-xs text-green-600 font-semibold mb-1">AVAILABILITY</div>
                    <div className="text-lg font-bold text-green-700 flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      {product.stock || 0} in stock
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                    <div className="text-xs text-orange-600 font-semibold mb-1">CATEGORY</div>
                    <div className="text-lg font-bold text-orange-700">
                      {product.category || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-600 transition-colors flex items-center justify-center font-bold text-xl"
                    >
                      -
                    </button>
                    <div className="w-20 h-12 rounded-xl bg-orange-50 border-2 border-orange-300 flex items-center justify-center font-bold text-lg text-orange-600">
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="w-12 h-12 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-600 transition-colors flex items-center justify-center font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  style={{ background: 'linear-gradient(135deg, #FF6600 0%, #FF7F32 100%)' }}
                  className="w-full py-4 hover:shadow-2xl hover:scale-[1.02] text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Buy Now
                </button>

                <button
                  onClick={handleAddToCart}
                  style={{ background: 'linear-gradient(135deg, #FFA500 0%, #FFB732 100%)' }}
                  className="w-full py-4 hover:shadow-2xl hover:scale-[1.02] text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>

                <button className="w-full py-4 bg-white hover:bg-orange-50 text-gray-700 font-semibold rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5 text-orange-600" />
                  Share Product
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-4">
              <Truck className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On orders over ৳500</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">100% secure transactions</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-4">
              <RotateCcw className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-sm">30-day return policy</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#CC5500' }}>
            <div className="w-1 h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, #FF6600, #FFA500)' }}></div>
            Product Specifications
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {product.weight && (
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <span className="text-sm text-orange-600 font-medium">Weight</span>
                <p className="text-gray-900 font-semibold mt-1">{product.weight}</p>
              </div>
            )}
            {product.dimensions && (
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <span className="text-sm text-orange-600 font-medium">Dimensions</span>
                <p className="text-gray-900 font-semibold mt-1">{product.dimensions}</p>
              </div>
            )}
            {product.status && (
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <span className="text-sm text-orange-600 font-medium">Status</span>
                <p className="text-gray-900 font-semibold mt-1">{product.status}</p>
              </div>
            )}
            {product.featured !== undefined && (
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <span className="text-sm text-orange-600 font-medium">Featured Product</span>
                <p className="text-gray-900 font-semibold mt-1">
                  {product.featured ? "Yes" : "No"}
                </p>
              </div>
            )}
            {(product.discountStart || product.discountEnd) && (
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 md:col-span-2">
                <span className="text-sm text-orange-600 font-medium">Discount Period</span>
                <p className="text-gray-900 font-semibold mt-1">
                  {product.discountStart || "N/A"} → {product.discountEnd || "N/A"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;