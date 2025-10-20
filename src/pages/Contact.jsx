// File: src/pages/ContactPage.jsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Users,
} from "lucide-react";

const API_URL = "https://shopnest-serveres.onrender.com/contact";

const slides = [
  { id: 1, image: "https://i.ibb.co.com/mF2XwpmC/abb5406d6819688ecb66c8de2d8f4c59.jpg", title: "Secure Your Future", subtitle: "Insurance made easy" },
  { id: 2, image: "https://i.ibb.co.com/rfMDXHQs/IA-et-search-engine-optimization-SEA-quels-d-fis-pour-les-entreprises.jpg", title: "24/7 Customer Support", subtitle: "Always here for you" },
  { id: 3, image: "https://i.ibb.co.com/m572xvtx/What-to-do-with-anonymous-letters-from-critics.jpg", title: "Trusted by Thousands", subtitle: "Reliable and transparent" },
];

const contactInfo = [
  { icon: Phone, title: "Call Us", value: "+880 1234-567890", color: "from-[#FF6600] to-[#FFA500]", description: "Mon-Fri, 9AM-6PM" },
  { icon: Mail, title: "Email Us", value: "support@insurance.com", color: "from-[#FF7F32] to-[#CC5500]", description: "24/7 Support Available" },
  { icon: MapPin, title: "Visit Us", value: "Dhaka, Bangladesh", color: "from-[#FF6600] to-[#FF7F32]", description: "Multiple Locations" },
];

const features = [
  { icon: Shield, text: "Secure Communication" },
  { icon: Clock, text: "Quick Response" },
  { icon: Users, text: "Expert Support Team" },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider auto-rotate
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
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
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      <Helmet>
        <title>Contact Us | Smart Insurance Bangladesh</title>
        <meta name="description" content="Get in touch with Smart Insurance Bangladesh for inquiries, support, claims, or quotes." />
      </Helmet>

      {/* Hero Slider */}
      <div className="relative w-full h-96 overflow-hidden rounded-none">
        <AnimatePresence>
          {slides.map((slide, index) =>
            index === currentSlide ? (
              <motion.div key={slide.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 w-full h-full">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{slide.title}</h2>
                  <p className="text-white text-lg md:text-xl">{slide.subtitle}</p>
                </div>
              </motion.div>
            ) : null
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

      {/* Contact Form & Info */}
      <div className="flex-1 px-6 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            {contactInfo.map((info, i) => (
              <div key={i} className="relative bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
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
            <div className="relative bg-gray-50 border border-gray-200 rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-black mb-8 text-center">Send Us a Message</h2>

              {/* Status Message */}
              {submitStatus && (
                <div
                  className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    submitStatus === "success"
                      ? "bg-green-100 border border-green-300 text-green-800"
                      : "bg-red-100 border border-red-300 text-red-800"
                  }`}
                >
                  {submitStatus === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span>{submitStatus === "success" ? "Message sent successfully!" : "Failed to send message."}</span>
                </div>
              )}

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name *"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  />
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full p-4 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="claims">Claims Support</option>
                    <option value="support">Technical Support</option>
                    <option value="quote">Get a Quote</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>

                <input
                  name="subject"
                  type="text"
                  placeholder="Subject *"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#FF6600] focus:border-transparent"
                />

                <textarea
                  name="message"
                  rows="5"
                  placeholder="Message *"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full p-4 bg-white border border-gray-300 rounded-xl text-black focus:ring-2 focus:ring-[#FF6600] focus:border-transparent resize-none"
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="group relative w-full py-4 px-8 bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] text-white font-bold text-lg rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative flex items-center justify-center gap-3">
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Send Message"}
                    {!isSubmitting && <Send className="w-5 h-5" />}
                  </div>
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
