// File: src/pages/ContactPage.jsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Send, Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, Shield, Users } from "lucide-react";

const API_URL = "https://shopnest-ecom.onrender.com/contact";

// Hero slides
const slides = [
  { id: 1, image: "https://i.ibb.co/mF2XwpmC/abb5406d6819688ecb66c8de2d8f4c59.jpg", title: "ShopNest Secure", subtitle: "Safe & Easy Shopping Experience" },
  { id: 2, image: "https://i.ibb.co/rfMDXHQs/IA-et-search-engine-optimization-SEA-quels-d-fis-pour-les-entreprises.jpg", title: "24/7 Support", subtitle: "We're always here to help" },
  { id: 3, image: "https://i.ibb.co/m572xvtx/What-to-do-with-anonymous-letters-from-critics.jpg", title: "Trusted by Thousands", subtitle: "Your favorite e-commerce destination" },
];

// Contact info
const contactInfo = [
  { icon: Phone, title: "Call Us", value: "+880 1234-567890", color: "from-[#FF6600] to-[#FFA500]", description: "Mon-Fri, 9AM-6PM" },
  { icon: Mail, title: "Email Us", value: "support@shopnest.com", color: "from-[#FF7F32] to-[#CC5500]", description: "24/7 Support Available" },
  { icon: MapPin, title: "Visit Us", value: "Sylhet, Bangladesh", color: "from-[#FF6600] to-[#FF7F32]", description: "Multiple Locations" },
];

// Features
const features = [
  { icon: Shield, text: "Secure Payment & Communication" },
  { icon: Clock, text: "Fast Response & Delivery" },
  { icon: Users, text: "Expert Customer Support" },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "", inquiryType: "general" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "", inquiryType: "general" });
      } else setSubmitStatus("error");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">

      {/* SEO */}
      <Helmet>
        <title>Contact Us | ShopNest</title>
        <meta name="description" content="Contact ShopNest for support, inquiries, or partnerships." />
      </Helmet>

     

      {/* Hero Slider */}
      <div className="relative w-full h-96 overflow-hidden">
        <AnimatePresence>
          {slides.map((slide, index) =>
            index === currentSlide && (
              <motion.div key={slide.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 w-full h-full">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{slide.title}</h2>
                  <p className="text-white text-lg md:text-xl">{slide.subtitle}</p>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Features */}
      <div className="text-center py-12 px-6">
        <div className="flex justify-center gap-8 flex-wrap">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-700 hover:text-[#FF6600] transition-colors duration-300">
              <feature.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Our Location</h2>
        <iframe
          title="ShopNest Sylhet Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.564264578348!2d91.86043107540956!3d24.894863784051224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37505968c1b3d33f%3A0x9d4f16f46f56d9aa!2sSylhet%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1698283670000!5m2!1sen!2sus"
          className="w-full h-72 rounded-2xl border-0"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Contact Section */}
      <div className="flex-1 px-6 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-start">
          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-8">
            {contactInfo.map((info, i) => (
              <div key={i} className="relative bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:bg-gray-100 transition-transform transform hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center shadow-md`}>
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-black font-semibold text-lg">{info.title}</h3>
                    <p className="text-gray-600 font-medium">{info.value}</p>
                    <p className="text-gray-500 text-sm">{info.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-black mb-8 text-center">Send Us a Message</h2>

              {submitStatus && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${submitStatus === "success" ? "bg-green-100 border-green-300 text-green-800" : "bg-red-100 border-red-300 text-red-800"}`}>
                  {submitStatus === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span>{submitStatus === "success" ? "Message sent successfully!" : "Failed to send message."}</span>
                </div>
              )}

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input name="name" type="text" placeholder="Full Name *" value={formData.name} onChange={handleChange} required className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6600]" />
                  <input name="email" type="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} required className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6600]" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6600]" />
                  <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6600]">
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="order">Order Related</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <input name="subject" type="text" placeholder="Subject *" value={formData.subject} onChange={handleChange} required className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6600]" />
                <textarea name="message" rows="5" placeholder="Message *" value={formData.message} onChange={handleChange} required className="w-full p-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6600] resize-none" />

                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] text-white font-bold rounded-2xl hover:scale-105 transition-transform disabled:opacity-50">
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : <div className="flex items-center justify-center gap-3"><Send className="w-5 h-5" /> Send Message</div>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
