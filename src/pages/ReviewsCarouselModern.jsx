// src/components/ReviewsCarouselModern.jsx
import React, { useEffect, useState } from "react";
import { FaStar, FaFacebookF, FaLinkedinIn, FaTwitter, FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import confetti from "canvas-confetti";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const ReviewsCarouselModern = () => {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("https://shopnest-serveres.onrender.com/users");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  // Trigger confetti when active slide changes
  useEffect(() => {
    if (reviews.length > 0) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#FF6600", "#FF7F32", "#FFA500", "#CC5500"],
        shapes: ["circle", "square"],
        scalar: 1.2,
      });
    }
  }, [activeIndex]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FFDAB9]/10 to-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6600]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FFA500]/5 rounded-full blur-3xl"></div>
      
      {/* Section */}
      <section className="py-20 px-6 md:px-12 relative z-10">
        {/* Section Title */}
        <div className="max-w-8xl mx-auto text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-[#FF6600] font-bold text-sm uppercase tracking-wider bg-[#FFDAB9]/30 px-4 py-2 rounded-full">
              Testimonials
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#CC5500] via-[#FF6600] to-[#FF7F32] bg-clip-text text-transparent leading-tight">
            What Our Customers Say
          </h2>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#FF6600] to-[#FFA500] mx-auto rounded-full mb-6"></div>
          
          <p className="text-gray-600 mt-2 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Trusted by thousands, our services continue to inspire confidence and satisfaction.  
            See why our clients love working with us.
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            spaceBetween={40}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 40 },
            }}
            className="pb-16 reviews-swiper"
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          >
            {reviews.map((review, index) => {
              const isActive = index === activeIndex;
              return (
                <SwiperSlide key={index}>
                  <div
                    className={`relative bg-white border-2 p-8 rounded-3xl shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] min-h-[420px] flex flex-col ${
                      isActive 
                        ? "border-[#FF6600] shadow-2xl review-glow" 
                        : "border-[#FFDAB9]/50 hover:border-[#FF7F32]"
                    }`}
                  >
                    {/* Quote Icon */}
                    <div className={`absolute -top-5 -left-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                      isActive 
                        ? "bg-gradient-to-br from-[#FF6600] to-[#CC5500]" 
                        : "bg-gradient-to-br from-[#FF7F32] to-[#FFA500]"
                    }`}>
                      <FaQuoteLeft className="text-white text-xl" />
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-6 pt-4">
                      <div className="relative">
                        <img
                          src={review.image || `https://i.pravatar.cc/150?img=${index + 10}`}
                          alt={review.name || "User"}
                          className={`w-20 h-20 rounded-full object-cover border-4 transition-all duration-500 ${
                            isActive
                              ? "border-[#FF6600] shadow-lg ring-4 ring-[#FF6600]/20"
                              : "border-[#FFDAB9]/50"
                          }`}
                        />
                        {isActive && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#FF6600] to-[#CC5500] rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-xl transition-colors duration-300 ${
                          isActive ? "text-[#CC5500]" : "text-gray-900"
                        }`}>
                          {review.name || "Anonymous"}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">
                          {review.service || "Insurance Service"}
                        </p>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-5">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          className={`text-lg transition-all duration-300 ${
                            starIndex < (review.rating || 0)
                              ? isActive 
                                ? "text-[#FF6600] drop-shadow-lg scale-110" 
                                : "text-[#FFA500] drop-shadow-sm"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-gray-600">
                        {review.rating || 5}.0
                      </span>
                    </div>

                    {/* Comment */}
                    <div className="flex-1 mb-6">
                      <p className="text-gray-700 leading-relaxed italic text-base">
                        "{review.comment || "Excellent service! Highly recommended for anyone looking for quality and reliability."}"
                      </p>
                    </div>

                    {/* Decorative Gradient Line */}
                    <div className={`h-1 rounded-full mb-5 transition-all duration-500 ${
                      isActive 
                        ? "bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500]" 
                        : "bg-gradient-to-r from-[#FFDAB9] to-transparent"
                    }`}></div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                      {review.social?.facebook && (
                        <a
                          href={review.social.facebook}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFDAB9]/50 to-[#FFDAB9]/30 hover:from-[#FF6600] hover:to-[#FF7F32] flex items-center justify-center text-[#CC5500] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        >
                          <FaFacebookF />
                        </a>
                      )}
                      {review.social?.linkedin && (
                        <a
                          href={review.social.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFDAB9]/50 to-[#FFDAB9]/30 hover:from-[#FF6600] hover:to-[#FF7F32] flex items-center justify-center text-[#CC5500] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        >
                          <FaLinkedinIn />
                        </a>
                      )}
                      {review.social?.twitter && (
                        <a
                          href={review.social.twitter}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFDAB9]/50 to-[#FFDAB9]/30 hover:from-[#FF6600] hover:to-[#FF7F32] flex items-center justify-center text-[#CC5500] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        >
                          <FaTwitter />
                        </a>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button className="swiper-button-prev-custom w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6600] to-[#FF7F32] hover:from-[#CC5500] hover:to-[#FF6600] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl">
              <span className="text-2xl">←</span>
            </button>
            <button className="swiper-button-next-custom w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6600] to-[#FF7F32] hover:from-[#CC5500] hover:to-[#FF6600] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl">
              <span className="text-2xl">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 102, 0, 0.3), 
                        0 0 40px rgba(255, 127, 50, 0.2), 
                        0 0 60px rgba(255, 165, 0, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 102, 0, 0.5), 
                        0 0 60px rgba(255, 127, 50, 0.3), 
                        0 0 80px rgba(255, 165, 0, 0.2);
          }
        }
        
        .review-glow {
          animation: glow-pulse 3s infinite alternate;
        }

        .reviews-swiper .swiper-pagination-bullet {
          background: #FFDAB9;
          opacity: 0.5;
          width: 12px;
          height: 12px;
          transition: all 0.3s;
        }

        .reviews-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #FF6600, #FF7F32);
          opacity: 1;
          width: 32px;
          border-radius: 6px;
        }

        .swiper-button-prev-custom:disabled,
        .swiper-button-next-custom:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ReviewsCarouselModern;