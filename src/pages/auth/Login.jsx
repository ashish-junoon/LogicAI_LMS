import { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import TextInput from "../../components/fields/TextInput";
import { SentEmailOtp, Userlogin } from "../../api/authApi";
import { useAuthData } from "../../context/authContext";
import { toast } from "react-toastify";
import officePulseLogo from "../../assets/img/officepulselogo2.png";

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

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const { login } = useAuthData();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await Userlogin({
        user_name: formData.email.trim(),
        password: otp,
      });

      if (!login(response)) {
        toast.error("Did not get valid token or expiry time!");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message;
      toast.error(
        message || "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  //Send OTP Function here
  const handleSendtOTP = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await SentEmailOtp({
        email: formData.email.trim(),
        type: "LOGIN",
      });

      if (response?.status) {
        toast.success(response?.message || "OTP sent successfully.");
        setOtpSent(true);
      } else {
        toast.error(response?.message || "Failed to send OTP.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message;

      toast.error(message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen bg-linear-to-br from-[#f0f4fa] to-[#e8edf5] flex font-['Inter',system-ui,sans-serif]">
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white overflow-hidden transition-all duration-300 max-lg:bg-transparent">
        {/* Left Panel - Branding/Info */}
        <div className="w-full lg:w-[45%] bg-linear-to-br from-blue-900 to-primary text-white p-8 lg:p-12 flex flex-col justify-between relative max-lg:hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

          {/* Logo */}
          <div className="relative">
            <div className="flex items-center gap-2"></div>
          </div>

          {/* Main Content */}
          <div className="relative py-12">
            <div className="mb-8 flex justify-center">
              <div className="w-36 h-36 bg-white/5 rounded-2xl flex items-center justify-center">
                <Icon name={slides[activeSlide].icon} color="white" size={64} />
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
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
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
              <span className="text-sm font-medium whitespace-nowrap">
                Need Help?
              </span>
              <div className="flex-1 border-t border-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon name={"IoCallOutline"} color="white" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Phone</p>
                  <p className="text-sm font-semibold">+91 1800 891 8297</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <Icon name={"IoMailOutline"} color="white" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Email</p>
                  <p className="text-sm font-semibold">
                    support@logicaitech.in
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-[55%] min-h-screen px-4 py-8 sm:px-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-sm mx-auto rounded-2xl border border-white/80 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(31,65,105,0.14)] sm:px-9 sm:py-10 lg:max-w-sm lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <div className="mb-9 flex justify-center lg:hidden">
              <img
                src={officePulseLogo}
                alt="Office Pulse"
                className="h-auto w-56 max-w-full object-contain"
              />
            </div>

            {/* Header */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Sign in to continue to your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={otpSent ? handleSubmit : handleSendtOTP}>
              <div className="space-y-5 mb-7">
                {/* Email */}
                <TextInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  required
                  disabled={otpSent}
                  style="py-3"
                />

                {/* OTP */}
                {otpSent && (
                  <div>
                    <TextInput
                      label="Enter OTP"
                      name="otp"
                      type="text"
                      placeholder="Enter 4-digit OTP"
                      value={otp}
                      maxLength={6}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, ""))
                      }
                      required
                      style="py-3"
                    />

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        OTP sent to {formData.email}
                      </p>

                      <button
                        type="button"
                        onClick={handleSendtOTP}
                        disabled={isLoading}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (otpSent && otp.length !== 4)}
                className="w-full py-3 bg-linear-to-r from-primary to-primary/70
    hover:from-primary hover:to-primary text-white font-medium
    rounded-lg transition-all duration-300 shadow-lg
    disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed
    active:scale-[0.98] text-sm"
              >
                {isLoading
                  ? "Please wait..."
                  : otpSent
                    ? "Verify OTP & Sign In"
                    : "Send OTP"}
              </button>

              {otpSent && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="w-full mt-4 text-sm text-gray-500 hover:text-primary"
                >
                  Change Email
                </button>
              )}
            </form>

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
