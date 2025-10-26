import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, Heart, Star, Truck, Check } from "lucide-react";

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

  const [selectedImage, setSelectedImage] = useState(product.images?.[0] || "/placeholder.png");

  const calculateDiscount = () => {
    if (product.hasDiscount && product.discountPrice && product.price) {
      const discount = ((product.price - product.discountPrice) / product.price) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discountPercent = calculateDiscount();
  const finalPrice = (product.discountPrice || product.price || 0) * quantity;

  const handleAddToCart = () => {
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to add items to your cart",
        icon: "warning",
        confirmButtonColor: "#FF6600",
        background: "#ffffff",
        customClass: { popup: "rounded-2xl" }
      });
      return;
    }

    const cartItem = {
      productId: product._id?.toString() || "N/A",
      productName: product.name || "Unnamed Product",
      productImage: selectedImage || product.images?.[0] || "/placeholder.png",
      quantity,
      unitPrice: product.discountPrice || product.price || 0,
      totalPrice: finalPrice,
      dateAdded: new Date().toISOString(),
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    Swal.fire({
      title: "Added to Cart!",
      text: `${cartItem.productName} has been added to your cart`,
      icon: "success",
      confirmButtonColor: "#FF6600",
      timer: 1600,
      showConfirmButton: false,
      customClass: { popup: "rounded-2xl" }
    });
  };

  // NEW: Navigate to Payment page with product + amount
  const handleBuyNow = () => {
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please log in to complete your purchase",
        icon: "warning",
        confirmButtonColor: "#FF6600",
        customClass: { popup: "rounded-2xl" }
      });
      return;
    }

    // Navigate to /payment (or /pay) with state
    navigate("/payment", {
      state: {
        product,
        amount: finalPrice,
        quantity,
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-6 lg:p-10 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="sticky top-6">
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
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-6 h-6 transition-all ${isWishlisted ? 'fill-orange-500 text-orange-500' : 'text-gray-600'}`} />
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images?.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${selectedImage === img ? "ring-4 ring-orange-500 scale-105 shadow-xl" : "ring-2 ring-gray-200 hover:ring-orange-300 hover:scale-105"}`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 lg:p-10 flex flex-col">
              <div className="flex-1">
                {product.brand && (
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full mb-4 border border-orange-200">
                    <span className="text-sm font-semibold text-orange-600">{product.brand}</span>
                  </div>
                )}

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">{product.name || "Unnamed Product"}</h1>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />))}
                  </div>
                  <span className="text-gray-600 text-sm font-medium">(4.8) 256 reviews</span>
                </div>

                <div className="flex items-baseline gap-4 mb-6">
                  <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                    ৳{(finalPrice).toLocaleString()}
                  </div>
                  {product.hasDiscount && product.price && (
                    <div className="text-2xl text-gray-400 line-through">৳{(product.price * quantity).toLocaleString()}</div>
                  )}
                </div>

                {product.description && (
                  <div className="mb-6 p-5 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="text-xs text-green-600 font-semibold mb-1">AVAILABILITY</div>
                    <div className="text-lg font-bold text-green-700 flex items-center gap-2"><Check className="w-5 h-5" />{product.stock || 0} in stock</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                    <div className="text-xs text-orange-600 font-semibold mb-1">CATEGORY</div>
                    <div className="text-lg font-bold text-orange-700">{product.category || "N/A"}</div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-600 transition-colors flex items-center justify-center font-bold text-xl">-</button>
                    <div className="w-20 h-12 rounded-xl bg-orange-50 border-2 border-orange-300 flex items-center justify-center font-bold text-lg text-orange-600">{quantity}</div>
                    <button onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))} className="w-12 h-12 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-600 transition-colors flex items-center justify-center font-bold text-xl">+</button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={handleBuyNow} style={{ background: 'linear-gradient(135deg, #FF6600 0%, #FF7F32 100%)' }} className="w-full py-4 hover:shadow-2xl hover:scale-[1.02] text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Buy Now
                </button>

                <button onClick={handleAddToCart} style={{ background: 'linear-gradient(135deg, #FFA500 0%, #FFB732 100%)' }} className="w-full py-4 hover:shadow-2xl hover:scale-[1.02] text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>

                <button className="w-full py-4 bg-white hover:bg-orange-50 text-gray-700 font-semibold rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 flex items-center justify-center gap-2">
                  <Truck className="w-5 h-5 text-orange-600" />
                  Shipping & Returns
                </button>
              </div>
            </div>
          </div>
        </div>

        <style>{`.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`}</style>
      </div>
    </div>
  );
};

export default ProductPage;
