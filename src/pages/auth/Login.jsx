import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      console.log("Login attempt", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Handle successful login
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4fa] to-[#e8edf5] flex items-center justify-center font-['Inter',system-ui,sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-full bg-white overflow-hidden transition-all duration-300 hover:shadow-[#0b1a2e]/20">
        
        {/* Left Panel - Branding/Info */}
        <div className="w-full md:w-[45%] bg-gradient-to-br from-[#11245B] to-[#1a3a6b] text-white p-8 md:p-12 flex flex-col justify-between relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
          
          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">i</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Loan Management System</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 py-12">            
            <div className="mb-8 flex justify-center">
              <div className="w-40 h-40 bg-white/10 rounded-2xl flex items-center justify-center">
                <svg className="w-22 h-22 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-3">Card Tokenization</h3>
              <p className="text-white/80 text-base leading-relaxed">
                Tokenization encrypts and replaces sensitive data like card numbers,
                expiry dates, and CVV with a secure token.
              </p>
            </div>

            {/* Slider Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              <span className="w-2.5 h-2.5 rounded-full bg-white/30"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-white/30"></span>
              <span className="w-8 h-2.5 rounded-full bg-[#6E63FF]"></span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 border-t border-white/20" />
              <span className="text-sm font-medium whitespace-nowrap">Need Help?</span>
              <div className="flex-1 border-t border-white/20" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Toll Free</p>
                  <p className="text-sm font-semibold">1800 891 8297</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Email</p>
                  <p className="text-sm font-semibold">support@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all duration-200"
                  required
                />
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  id="rememberMe"
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-400/40 focus:ring-2 transition"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#0b1f33] to-[#1a3650] hover:from-[#132b42] hover:to-[#1f3f5a] text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-[#0b1f33]/20 hover:shadow-[#0b1f33]/30 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <span className="text-gray-500">
                Don't have an account?{" "}
                <a href="#" className="text-gray-900 font-medium hover:text-emerald-600 transition-colors">
                  Create account
                </a>
              </span>
              <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Partner Login
              </a>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Mobile App Link */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms &amp; Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;