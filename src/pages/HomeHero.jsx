import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ModernHeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("https://shopnest-ecom.onrender.com/sectionhero");
        const data = await res.json();
        setSlides(data);
      } catch (err) {
        console.error("Failed to fetch hero carousel data:", err);
        // Fallback demo data
        setSlides([
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            title: "Discover Amazing Experiences",
            description: "Explore the world with our curated collection",
            buttonText: "Get Started",
            colorHex: "#6366f1",
          },
          {
            id: 2,
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
            title: "Innovation Meets Design",
            description: "Creating beautiful solutions for modern challenges",
            buttonText: "Learn More",
            colorHex: "#8b5cf6",
          },
          {
            id: 3,
            image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
            title: "Elevate Your Journey",
            description: "Premium experiences tailored just for you",
            buttonText: "Explore Now",
            colorHex: "#ec4899",
          },
        ]);
      }
    };
    fetchSlides();
  }, []);

  // Slide navigation helpers
  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback(
    (index) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  // Auto-slide every 6s
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [slides.length, nextSlide]);

  if (slides.length === 0) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* AnimatePresence Slides */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{ backgroundColor: currentSlide.colorHex, opacity: 0.3 }}
          />

          {/* Content Card */}
          <div className="absolute inset-0 flex items-center justify-center px-6 md:px-16">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-3xl backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-1 rounded-full" style={{ backgroundColor: currentSlide.colorHex }} />
                <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">Featured</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{currentSlide.title}</h1>
              <p className="text-white/90 text-lg md:text-xl mb-6">{currentSlide.description}</p>
              {currentSlide.buttonText && (
                <button
                  className="px-8 py-4 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-400 hover:scale-105 transition-transform"
                >
                  {currentSlide.buttonText} <ChevronRight className="inline w-5 h-5 ml-2" />
                </button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl p-3 rounded-full text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-xl p-3 rounded-full text-white hover:bg-white/20 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/40"}`}
              whileHover={{ scale: 1.5 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernHeroSlider;
