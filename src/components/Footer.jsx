// File: src/components/Footer.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Gem,
  Plane,
  Shield,
  Heart,
  Flame,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  ExternalLink,
  ChevronUp,
} from "lucide-react";
import Loader from "./Loader";

const API_SUBSCRIBE = "https://shopnest-ecom.onrender.com/subscribers";

const categories = [
  { name: "Men's Fashion", icon: Car },
  { name: "Women's Fashion", icon: Gem },
  { name: "Electronics", icon: Plane },
  { name: "Home & Living", icon: Shield },
  { name: "Beauty & Care", icon: Heart },
  { name: "Sports & Outdoor", icon: Flame },
];

const usefulLinks = ["Deals", "New Arrivals", "Blog", "Contact Us", "FAQ"];

const socialLinks = [
  { platform: "Facebook", icon: Facebook, href: "#" },
  { platform: "Instagram", icon: Instagram, href: "#" },
  { platform: "LinkedIn", icon: Linkedin, href: "#" },
  { platform: "YouTube", icon: Youtube, href: "#" },
];

const Footer = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [subscribeData, setSubscribeData] = useState({ name: "", email: "" });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Loader simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowTopBtn(true);
      else setShowTopBtn(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Handle subscription input change
  const handleSubscribeChange = (e) => {
    setSubscribeData({ ...subscribeData, [e.target.name]: e.target.value });
  };

  // Handle subscription submit
  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    const subscriberName = subscribeData.name;
    try {
      const res = await fetch(API_SUBSCRIBE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscribeData),
      });
      if (res.ok) {
        setStatus({ type: "success", name: subscriberName });
        setSubscribeData({ name: "", email: "" });
      } else setStatus({ type: "error" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error" });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <footer className="relative overflow-hidden bg-white text-black">
        {/* Background Accent Circles */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6600] rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFA64D] rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1300px] mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Logo & About */}
            <div className="lg:col-span-1">
              <div className="mb-8">
                <img src="shopNest.svg" alt="ShopNest Logo" className="w-28 h-auto mb-4" />
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                ShopNest is your ultimate e-commerce destination for the latest products, deals, and a seamless shopping experience.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-[#FF6600] rounded-full animate-pulse"></div>
                <span>Trusted by 50,000+ shoppers</span>
              </div>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="text-gray-800 font-bold text-lg mb-6 relative">
                Categories
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#FF6600] rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                {categories.map((cat, idx) => (
                  <li key={idx} className="group cursor-pointer">
                    <div className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-all duration-300">
                      <div className="text-[#FF6600] w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <cat.icon className="w-full h-full" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-gray-800 font-bold text-lg mb-6 relative">
                Useful Links
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#FF6600] rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                {usefulLinks.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="text-gray-600 hover:text-gray-800 transition-all duration-300 flex items-center group text-sm">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 group-hover:bg-[#FF6600] transition-colors"></div>
                      {link}
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF6600]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe & Contact */}
            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-gray-800 font-bold text-lg mb-6 relative">
                Subscribe & Contact
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-[#FF6600] rounded-full"></div>
              </h3>

              {/* Subscribe Form */}
              <form onSubmit={handleSubscribeSubmit} className="space-y-4 max-w-md relative">
                <AnimatePresence>
                  {status?.type === "success" && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-0 left-0 right-0 p-4 mb-2 rounded-lg text-sm bg-green-100 text-green-800 shadow-md text-center"
                    >
                      🎉 Thanks for subscribing, {status.name || "there"}!
                    </motion.div>
                  )}
                  {status?.type === "error" && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute top-0 left-0 right-0 p-4 mb-2 rounded-lg text-sm bg-red-100 text-red-800 shadow-md text-center"
                    >
                      ❌ Subscription failed. Please try again.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    name="name"
                    value={subscribeData.name}
                    onChange={handleSubscribeChange}
                    placeholder="Full Name"
                    required
                    className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6600] transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    value={subscribeData.email}
                    onChange={handleSubscribeChange}
                    placeholder="Email Address"
                    required
                    className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6600] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] text-white font-bold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  {isSubmitting ? "Submitting..." : "Subscribe"}
                </button>
              </form>

              {/* Contact Info */}
              <div className="space-y-4 mt-6">
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-10 h-10 bg-[#FF6600]/10 rounded-xl flex items-center justify-center">
                    <Phone className="text-[#FF6600] w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold">16457</p>
                    <p className="text-xs text-gray-500">Hotline</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <div className="w-10 h-10 bg-[#FF6600]/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="text-[#FF6600] w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-800">01730031888</p>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-3 mt-4">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="w-12 h-12 bg-[#FF6600] rounded-xl flex items-center justify-center transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg text-white"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 ShopNest. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-[#FF6600] text-sm transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-[#FF6600] text-sm transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-2xl transition-all z-50"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
