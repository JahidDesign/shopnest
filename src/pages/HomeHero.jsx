import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ModernHeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Fetch slides from backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("https://shopnest-serveres.onrender.com/heroCarousel");
        const data = await res.json();
        setSlides(data);
      } catch (err) {
        console.error("Failed to fetch hero carousel data:", err);
        // Fallback demo data for preview
        setSlides([
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            title: "Discover Amazing Experiences",
            description: "Explore the world with our curated collection",
            buttonText: "Get Started",
            colorHex: "#6366f1"
          },
          {
            id: 2,
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
            title: "Innovation Meets Design",
            description: "Creating beautiful solutions for modern challenges",
            buttonText: "Learn More",
            colorHex: "#8b5cf6"
          },
          {
            id: 3,
            image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
            title: "Elevate Your Journey",
            description: "Premium experiences tailored just for you",
            buttonText: "Explore Now",
            colorHex: "#ec4899"
          }
        ]);
      }
    };
    fetchSlides();
  }, []);

  // Auto-slide with typing reset
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setIsTyping(false);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % slides.length);
          setIsTyping(true);
        }, 300);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  const nextSlide = () => {
    setIsTyping(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setIsTyping(true);
    }, 300);
  };

  const prevSlide = () => {
    setIsTyping(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTyping(true);
    }, 300);
  };

  const goToSlide = (index) => {
    setIsTyping(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTyping(true);
    }, 300);
  };

  if (slides.length === 0) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `scale(${isTyping ? 1.05 : 1.1})`,
        }}
      >
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          className="w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: isTyping ? 1 : 0.7 }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Animated Color Overlay */}
        <div 
          className="absolute inset-0 mix-blend-multiply transition-opacity duration-700"
          style={{
            backgroundColor: currentSlide.colorHex,
            opacity: 0.3
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
          <div className="max-w-3xl">
            {/* Glassmorphic Content Card */}
            <div className={`backdrop-blur-md bg-white/10 rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-2xl transition-all duration-700 ${
              isTyping ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {/* Subtitle/Category */}
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div 
                  className="w-12 sm:w-16 h-1 rounded-full transition-all duration-500"
                  style={{ backgroundColor: currentSlide.colorHex }}
                />
                <span className="text-xs sm:text-sm font-semibold text-white/80 uppercase tracking-wider">
                  Featured
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                {currentSlide.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed">
                {currentSlide.description}
              </p>

              {/* CTA Button */}
              {currentSlide.buttonText && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="group relative px-8 py-4 rounded-full font-semibold text-base sm:text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{ backgroundColor: currentSlide.colorHex }}
                  >
                    <span className="relative z-10 text-white flex items-center justify-center gap-2">
                      {currentSlide.buttonText}
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                  
                  <button className="px-8 py-4 rounded-full font-semibold text-base sm:text-lg border-2 border-white/30 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center group shadow-xl z-10"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center group shadow-xl z-10"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}

      {/* Modern Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 sm:gap-3 backdrop-blur-md bg-white/10 px-4 sm:px-6 py-3 sm:py-4 rounded-full border border-white/20 shadow-xl">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="group relative"
              >
                <div className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-10 sm:w-12 h-2 sm:h-2.5"
                    : "w-2 sm:w-2.5 h-2 sm:h-2.5 hover:w-4 sm:hover:w-5"
                }`}
                style={{
                  backgroundColor: index === currentIndex ? currentSlide.colorHex : 'rgba(255,255,255,0.4)'
                }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute top-6 sm:top-8 right-4 sm:right-8 backdrop-blur-md bg-white/10 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/20 shadow-xl z-10">
        <span className="text-white font-semibold text-sm sm:text-base">
          {String(currentIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Decorative Gradient Orbs */}
      <div 
        className="absolute top-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ backgroundColor: currentSlide.colorHex }}
      />
      <div 
        className="absolute bottom-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20 animate-pulse"
        style={{ backgroundColor: currentSlide.colorHex, animationDelay: '1s' }}
      />
    </div>
  );
};

export default ModernHeroSlider;