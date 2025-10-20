import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const productsData = [
  {
    id: 1,
    title: "Just ask our employees",
    image: "https://i.ibb.co.com/1Gjy7n5m/smiling-woman-with-colorful-packets-case.jpg",
    link: "/products",
  },
  {
    id: 2,
    title: "Premium Makeup Products",
    image: "https://i.ibb.co.com/Z6gYRryK/makeUp.jpg",
    link: "/products",
  },
  {
    id: 3,
    title: "Daily Essentials",
    image: "https://i.ibb.co.com/4h3Q0fb/portrat-trendy-feminine-girl-posing-with-shopping-bags-from-store-credit-card-paying-contactless-buy.jpg",
    link: "/products/essentials",
  },
  {
    id: 4,
    title: "Smart Kitchen Items",
    image: "/images/kitchen.jpg",
    link: "/products/kitchen",
  },
];

const ProductSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productsData.length);
    }, 3000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-[450px]">
        {productsData.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              x: index === currentSlide ? 0 : -300,
            }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-center"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start text-left p-10">
              <h3 className="text-white text-3xl md:text-4xl font-bold mb-4">
                {product.title}
              </h3>
              <Link
                to={product.link}
                className="bg-[#FF6600] text-white px-6 py-3 rounded-full hover:bg-orange-500 transition"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
        {productsData.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-[#FF6600]" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
