// src/components/Newsletter.jsx
import React, { useState, useEffect, useRef } from "react";
import { Users, Mail, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";

const Newsletter = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0); // For animation
  const [existingEmails, setExistingEmails] = useState(new Set());
  const rafRef = useRef(null);

  // Fetch existing subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch("https://shopnest-ecom.onrender.com/subscribers");
        if (!res.ok) throw new Error("Failed to fetch subscribers");
        const data = await res.json();
        setSubscriberCount(data.length);
        setExistingEmails(new Set(data.map(sub => sub.email.toLowerCase())));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubscribers();
  }, []);

  // Animate subscriber count
  useEffect(() => {
    let start = displayCount;
    let end = subscriberCount;
    let startTime = null;

    const duration = 800; // in ms

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      setDisplayCount(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [subscriberCount]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailLower = form.email.toLowerCase();

    if (!form.name || !form.email) return toast.warning("⚠️ Name and email are required");
    if (!isValidEmail(form.email)) return toast.error("❌ Invalid email address");
    if (existingEmails.has(emailLower)) return toast.error("❌ Already subscribed");

    try {
      setSubmitting(true);
      const res = await fetch("https://shopnest-ecom.onrender.com/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: emailLower }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");

      toast.success("🎉 Subscribed successfully!");
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#FF6600","#FF7F32","#FFA500","#FFDAB9","#CC5500"],
      });

      setForm({ name: "", email: "" });
      setSubscriberCount(prev => prev + 1); // triggers animation
      setExistingEmails(prev => new Set(prev).add(emailLower));
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const floatingAnimation = (delay) => ({
    animation: `bounce 3s ${delay} infinite`,
  });

  return (
    <div className="min-h-screen bg-[#FFDAB9] relative">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto py-20 px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#FF6600] via-[#FF7F32] to-[#FFA500] opacity-40 animate-pulse-slow"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#FF7F32] via-[#FFA500] to-[#FFDAB9] opacity-40 animate-pulse-slow"></div>
          </div>

          {/* Floating icons */}
          <div className="absolute top-0 left-1/4" style={floatingAnimation("0s")}>
            <Mail className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-tr from-[#FF6600] via-[#FF7F32] to-[#FFA500] animate-glow" />
          </div>
          <div className="absolute top-10 right-1/4" style={floatingAnimation("1s")}>
            <Sparkles className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-tr from-[#FF7F32] via-[#FFA500] to-[#FF6600] animate-glow" />
          </div>
          <div className="absolute top-5 left-1/3" style={floatingAnimation("2s")}>
            <Users className="w-4 h-4 text-transparent bg-clip-text bg-gradient-to-tr from-[#FFA500] via-[#FF6600] to-[#FF7F32] animate-glow" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Stay in the
            <span className="bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] bg-clip-text text-transparent"> Loop</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] mx-auto mb-8 rounded-full"></div>
          <p className="text-gray-900 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            Join thousands of readers who get exclusive insights, early access content, and expert tips delivered straight to their inbox.
          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-800 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF6600] rounded-full animate-pulse"></div>
              <span>{displayCount}+ subscribers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF7F32] rounded-full animate-pulse"></div>
              <span>Weekly updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FFA500] rounded-full animate-pulse"></div>
              <span>No spam ever</span>
            </div>
          </div>
        </div>

        {/* Subscription Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-[#FF6600] rounded-none shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] rounded-2xl mb-4 animate-glow">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Subscribe Now</h3>
              <p className="text-gray-700">Get the latest updates delivered to your inbox</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF6600] outline-none placeholder-gray-500 transition-all duration-200"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF6600] outline-none placeholder-gray-500 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto mx-auto flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#FF6600] via-[#FF7F32] to-[#FFA500] text-white font-semibold rounded-2xl shadow-lg hover:from-[#FF7F32] hover:via-[#FFA500] hover:to-[#FF6600] transition-all duration-300 animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <>
                    Subscribe Now
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tailwind custom animations */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px #FF6600); }
          50% { filter: drop-shadow(0 0 15px #FFA500); }
        }
        .animate-glow { animation: glow 2s infinite alternate; }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 6s infinite; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Newsletter;
