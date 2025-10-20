import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";

const productsData = [
  {
    id: 1,
    title: "Just ask our employees",
    subtitle: "Expert recommendations for your perfect style",
    image: "https://i.ibb.co.com/1Gjy7n5m/smiling-woman-with-colorful-packets-case.jpg",
    link: "/products",
    gradient: "from-purple-600/80 via-pink-600/70 to-orange-500/60",
  },
  {
    id: 2,
    title: "Premium Makeup Products",
    subtitle: "Luxury beauty essentials for modern you",
    image: "https://i.ibb.co.com/Z6gYRryK/makeUp.jpg",
    link: "/products",
    gradient: "from-rose-600/80 via-pink-500/70 to-amber-500/60",
  },
  {
    id: 3,
    title: "Daily Essentials",
    subtitle: "Everything you need for everyday elegance",
    image: "https://i.ibb.co.com/4h3Q0fb/portrat-trendy-feminine-girl-posing-with-shopping-bags-from-store-credit-card-paying-contactless-buy.jpg",
    link: "/products/essentials",
    gradient: "from-blue-600/80 via-cyan-500/70 to-teal-500/60",
  },
  {
    id: 4,
    title: "Smart Kitchen Items",
    subtitle: "Innovative solutions for culinary excellence",
    image: "https://i.ibb.co.com/My1W47WZ/excited-girl-open-up-shopping-bags-gasping-amazed-checking-out-gifts-her-with-happy-face-sta.jpg",
    link: "/products/kitchen",
    gradient: "from-emerald-600/80 via-green-500/70 to-lime-500/60",
  },
];

const ProductSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % productsData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + productsData.length) % productsData.length);
  };

  const handleDotClick = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      }
    }),
  };

  const currentProduct = productsData[currentSlide];

  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Slider Container */}
      <div className="relative w-full h-[450px] sm:h-[400px] lg:h-[500px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Parallax Effect */}
            <motion.div
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <img
                src={currentProduct.image}
                alt={currentProduct.title}
                className="w-full h-full object-centre object-top"
              />
              {/* Sophisticated Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${currentProduct.gradient} mix-blend-multiply`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            </motion.div>

            {/* Floating Decorative Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl"
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.08, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-32 left-20 w-96 h-96 bg-orange-400 rounded-full blur-3xl"
            ></motion.div>

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6 sm:px-10 lg:px-16 max-w-7xl">
                <div className="max-w-3xl">
                  {/* Sparkle Icon */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                  >
                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400" />
                  </motion.div>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-orange-300 text-sm sm:text-base font-medium tracking-wider uppercase mb-4"
                  >
                    {currentProduct.subtitle}
                  </motion.p>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                  >
                    {currentProduct.title}
                  </motion.h2>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-4"
                  >
                    <motion.a
                      href={currentProduct.link}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative">Shop Now</span>
                      <ShoppingBag className="relative w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.a>

                    <motion.a
                      href="#explore"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                    >
                      Explore More
                    </motion.a>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-xl"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-xl"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </motion.button>
      </div>

      {/* Modern Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
        {productsData.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleDotClick(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="relative group"
          >
            {/* Progress Ring */}
            {index === currentSlide && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 -m-1"
              >
                <svg className="w-6 h-6 -rotate-90">
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-orange-400"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </svg>
              </motion.div>
            )}
            
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-orange-500 scale-125"
                  : "bg-white/50 group-hover:bg-white/80"
              }`}
            ></div>
          </motion.button>
        ))}
      </div>

      {/* Slide Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 right-8 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20"
      >
        {currentSlide + 1} / {productsData.length}
      </motion.div>
    </div>
  );
};

export default ProductSlider;