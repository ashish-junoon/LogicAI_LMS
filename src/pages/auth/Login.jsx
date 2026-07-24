import React, { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import TextInput from "../../components/fields/TextInput";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: "FaCreditCard",
      title: "Loan Management",
      description:
        "End-to-end digital loan processing from application to repayment.",
    },
    {
      icon: "FaUsers",
      title: "Customer Management",
      description:
        "Manage customer profiles, KYC, and loan history in one place.",
    },
    {
      icon: "FaChartLine",
      title: "Smart Analytics",
      description:
        "Monitor loan performance and business insights with real-time dashboards.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);


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
    <div className="h-screen bg-linear-to-br from-[#f0f4fa] to-[#e8edf5] flex font-['Inter',system-ui,sans-serif]">
      <div className="flex flex-col md:flex-row w-full bg-white overflow-hidden transition-all duration-300 hover:shadow-[#0b1a2e]/20">

        {/* Left Panel - Branding/Info */}
        <div className="w-full md:w-[45%] bg-linear-to-br from-[#11245B] to-[#1a3a6b] text-white p-8 md:p-12 flex flex-col justify-between relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

          {/* Logo */}
          <div className="relative">
            <div className="flex items-center gap-2">
            </div>
          </div>

          {/* Main Content */}
          <div className="relative py-12">
            <div className="mb-8 flex justify-center">
              <div className="w-36 h-36 bg-white/5 rounded-2xl flex items-center justify-center">
                <Icon
                  name={slides[activeSlide].icon}
                  color="white"
                  size={64}
                />
              </div>
            </div>

            <div className="transition-all duration-500 ease-in-out text-center mx-16">
              <h3 className="text-2xl font-semibold mb-3">
                {slides[activeSlide].title}
              </h3>

              <p className="text-white/80 mx-16 text-base leading-relaxed">
                {slides[activeSlide].description}
              </p>
            </div>

            {/* Slider Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeSlide === index
                      ? "w-8 bg-[#6E63FF]"
                      : "w-2.5 bg-white/30 hover:bg-white/60"
                    }`}
                />
              ))}
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
                  <Icon name={'IoCallOutline'} color="white" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Phone</p>
                  <p className="text-sm font-semibold">+91 1800 891 8297</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <Icon name={'IoMailOutline'} color="white" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Email</p>
                  <p className="text-sm font-semibold">support@logicaitech.in</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex items-center">
          <div className="w-full max-w-sm mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-3 mb-6">
                <TextInput label="Email" placeholder={"Enter your email address"} style={"py-1.5"} />
                <div className="space-y-2">
                  <TextInput label={"Password"} type="password" placeholder="Enter your password" hideEye={false} style={"py-1.5"} />
                  <div className="text-end text-primary text-sm font-semibold">Forgot Password?</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-linear-to-r from-primary to-primary/70 hover:from-primary hover:to-primary text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-[#0b1f33]/20 hover:shadow-[#0b1f33]/30 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-sm"
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
              {/* <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors flex items-center gap-1.5">
                <Icon name='FaLink' color="" size={12} />
                Terms and Conditions
              </a> */}
            </div>

            {/* Divider */}
            {/* <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-gray-400">or continue with</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;