// LoadingSpinner.jsx
import React from "react";
import { Shield } from "lucide-react";

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="relative w-16 h-16">
      {/* Spinner Circle */}
      <div className="absolute inset-0 border-4 border-[#FF6600]/30 border-t-[#FF6600] rounded-full animate-spin"></div>
      <Shield className="absolute inset-0 m-auto w-8 h-8 text-[#FF6600]" />
    </div>

    {/* Bouncing Dots */}
    <div className="flex justify-center space-x-2 absolute bottom-[-2rem] w-full">
      <div className="w-3 h-3 bg-[#FF6600] rounded-full animate-bounce"></div>
      <div className="w-3 h-3 bg-[#FF6600] rounded-full animate-bounce delay-150"></div>
      <div className="w-3 h-3 bg-[#FF6600] rounded-full animate-bounce delay-300"></div>
    </div>
  </div>
);




export default Loader;
