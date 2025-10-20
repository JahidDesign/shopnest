import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";

const HomeBannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetch("https://shopnest-serveres.onrender.com/homebanners")
      .then((res) => res.json())
      .then((data) => {
        setBanners(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching banners:", err);
        setIsLoading(false);
      });
  }, []);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  useEffect(() => {
    if (banners.length === 0 || isPaused) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [banners.length, isPaused, goToNext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  if (isLoading) {
    return (
      <div className="w-full h-96 md:h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center rounded-none overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,102,0,0.1),transparent_50%)]"></div>
        <div className="text-center z-10">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white/70 font-medium">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-96 md:h-[500px] bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center rounded-none">
        <p className="text-white/50">No banners available</p>
      </div>
    );
  }

  const current = banners[currentIndex];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div 
      className="relative w-full h-64 md:h-[500px] overflow-hidden rounded-none group bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Banner carousel"
      aria-live="polite"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-purple-500/20 opacity-50 blur-3xl animate-pulse"></div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          {/* Image with Parallax Effect */}
          <motion.img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 5 }}
          />

          {/* Modern Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Glassmorphism Content Card */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-8xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-md border border-orange-500/30 px-4 py-2 rounded-full mb-4"
              >
                <Sparkles size={16} className="text-orange-400" />
                <span className="text-orange-300 text-xs font-semibold uppercase tracking-wider">Featured</span>
              </motion.div>

              {/* Title */}
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight"
                style={{
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(to right, #ffffff, #ffa500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {current.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-white/90 text-base sm:text-xl mb-6 leading-relaxed font-light max-w-xl"
              >
                {current.subtitle}
              </motion.p>

              {/* CTA Button */}
              {current.buttonText && (
                <motion.a
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  href={current.buttonLink || "#"}
                  className="group/btn inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6600] to-[#FF8533] hover:from-[#FF7F32] hover:to-[#FFA500] text-white px-8 py-4 rounded-full text-base font-bold transition-all duration-300 shadow-[0_0_30px_rgba(255,102,0,0.3)] hover:shadow-[0_0_40px_rgba(255,102,0,0.5)] hover:scale-105 relative overflow-hidden"
                >
                  <span className="relative z-10">{current.buttonText}</span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <ChevronRight size={20} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                </motion.a>
              )}
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        </motion.div>
      </AnimatePresence>

      {/* Futuristic Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <motion.button
            onClick={goToPrev}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            aria-label="Previous banner"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <motion.button
            onClick={goToNext}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
            aria-label="Next banner"
          >
            <ChevronRight size={24} />
          </motion.button>
        </>
      )}

      {/* Pause/Play Control */}
      {banners.length > 1 && (
        <motion.button
          onClick={() => setIsPaused(!isPaused)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
        >
          {isPaused ? <Play size={18} /> : <Pause size={18} />}
        </motion.button>
      )}

      {/* Modern Progress Bar Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-black/30 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-full">
          {banners.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="relative group/dot"
              aria-label={`Go to banner ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            >
              <div
                className={`transition-all duration-500 rounded-full ${
                  index === currentIndex
                    ? "w-10 h-2 bg-gradient-to-r from-[#FF6600] to-[#FFA500]"
                    : "w-2 h-2 bg-white/40 group-hover/dot:bg-white/60"
                }`}
              />
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-orange-400/50 blur-md"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Elegant Counter Badge */}
      {banners.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 left-6 bg-black/30 backdrop-blur-xl border border-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wider"
        >
          <span className="text-orange-400">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="text-white/50 mx-1">/</span>
          <span className="text-white/70">{String(banners.length).padStart(2, '0')}</span>
        </motion.div>
      )}
    </div>
  );
};

export default HomeBannerSlider;