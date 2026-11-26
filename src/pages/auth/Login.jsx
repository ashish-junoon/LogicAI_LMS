import { useEffect, useState } from "react";
import Icon from "../../components/utils/Icon";
import TextInput from "../../components/fields/TextInput";
import {
  SentEmailOtp,
  SentSmsOtp,
  Userlogin,
} from "../../api/authApi";
import { useAuthData } from "../../context/authContext";
import { toast } from "react-toastify";
import officePulseLogo from "../../assets/img/officepulselogo2.png";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplateNoReload,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";

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
    mobile: "",
  });
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [loginType, setLoginType] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const { login } = useAuthData();

  const currentValue =
    loginType === "email"
      ? formData.email
      : formData.mobile;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Initialise captcha on mount
  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  // OTP resend countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleCaptchaReload = () => {
    loadCaptchaEnginge(6);
    setCaptchaValue("");
     setCaptchaError("");
  };

  // Change Login Method
  const handleLoginTypeChange = (type) => {
    if (loginType === type) return;

    setLoginType(type);
    setOtpSent(false);
    setOtp("");
    setCaptchaValue("");
    loadCaptchaEnginge(6); // fresh captcha for the new form
    setResendTimer(0);
    setCaptchaError("");
  };

  // Send Email / Mobile OTP
  const handleSendOTP = async (e, isResend = false) => {
    e?.preventDefault();

    // Validate captcha only for the initial send (not for resend)
    if (!isResend) {
      if (!captchaValue.trim()) {
        setCaptchaError("Please enter the captcha");
        return;
      }

      if (!validateCaptcha(captchaValue, false)) {
        setCaptchaError("Invalid captcha. Please try again.");
        return;
      }

      setCaptchaError("");
    }

    const value = currentValue.trim();

    if (!value) {
      toast.error(
        loginType === "email"
          ? "Please enter email address"
          : "Please enter mobile number"
      );
      return;
    }

    if (loginType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        toast.error("Please enter a valid email address");
        return;
      }
    } else {
      if (!/^[6-9]\d{9}$/.test(value)) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
    }

    setIsLoading(true);

    try {
      const response =
        loginType === "email"
          ? await SentEmailOtp({
            email: value,
            type: "LOGIN",
          })
          : await SentSmsOtp({
            mobile_no: value,
            type: "LOGIN",
          });

      if (response?.status) {
        toast.success(
          response?.message || "OTP sent successfully."
        );
        setOtpSent(true);
        setOtp("");
        // Start 60-second resend countdown
        setResendTimer(60);

        setCaptchaValue("");
      } else {
        toast.error(response?.message || "Failed to send OTP.");
        setCaptchaValue("");
        // loadCaptchaEnginge(6); // refresh on failure too
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.title ||
        error.message;

      toast.error(message || "Failed to send OTP.");
      setCaptchaValue("");
      loadCaptchaEnginge(6);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{4}$/.test(otp)) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Userlogin({
        user_name: currentValue.trim(),
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
        message || "Login failed. Please check your OTP and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Change Email / Mobile
  const handleChangeContact = () => {
    setOtpSent(false);
    setOtp("");
    setCaptchaValue("");
    setResendTimer(0);
    loadCaptchaEnginge(6);
    setCaptchaError("");
  };

  return (
    <div className="min-h-screen lg:h-screen bg-linear-to-br from-[#f0f4fa] to-[#e8edf5] flex font-['Inter',system-ui,sans-serif]">
      <div className="flex flex-col lg:flex-row w-full min-h-screen bg-white overflow-hidden transition-all duration-300 max-lg:bg-transparent">

        {/* Left Panel */}
        <div className="w-full lg:w-[45%] bg-linear-to-br from-blue-900 to-primary text-white p-8 lg:p-12 flex flex-col justify-between relative max-lg:hidden">

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

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

            <div className="flex justify-center gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
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
              <span className="text-sm font-medium whitespace-nowrap">
                Need Help?
              </span>
              <div className="flex-1 border-t border-white/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon name="IoCallOutline" color="white" />
                </div>
                <div>
                  <p className="text-white/60 text-xs">Phone</p>
                  <p className="text-sm font-semibold">
                    +91 1800 891 8297
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon name="IoMailOutline" color="white" />
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

        {/* Right Panel */}
        <div className="w-full lg:w-[55%] min-h-screen px-4 py-8 sm:px-8 lg:p-12 flex items-center justify-center">

          <div className="w-full max-w-sm mx-auto rounded-2xl border border-white/80 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(31,65,105,0.14)] sm:px-9 sm:py-10 lg:max-w-sm lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">

            {/* Logo */}
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

            {/* Login Type Toggle */}
            {!otpSent && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Login with
                </p>

                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">

                  <button
                    type="button"
                    onClick={() => handleLoginTypeChange("email")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${loginType === "email"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                      }`}
                  >
                    <Icon name="IoMailOutline" size={18} />
                    Email
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLoginTypeChange("mobile")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${loginType === "mobile"
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                      }`}
                  >
                    <Icon name="IoCallOutline" size={18} />
                    Mobile
                  </button>

                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={otpSent ? handleSubmit : handleSendOTP}>

              <div className="space-y-5 mb-7">

                {/* Email Input */}
                {loginType === "email" ? (
                  <TextInput
                    label="Email Address"
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
                ) : (
                  /* Mobile Input */
                  <TextInput
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    maxLength={10}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        mobile: event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10),
                      }))
                    }
                    required
                    disabled={otpSent}
                    style="py-3"
                  />
                )}

                {/* CAPTCHA — only before OTP is sent */}
                {!otpSent && (
                  <div className="-mb-2">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Enter the code below
                    </p>

                    <div
                      className="flex items-start flex-wrap"
                    >
                      <LoadCanvasTemplateNoReload />
                      <button
                        type="button"
                        onClick={handleCaptchaReload}
                        title="Reload CAPTCHA"
                        className="pe-2 pt-1 rounded-lg text-primary cursor-pointer transition-colors"
                      >
                        <Icon name="IoReload" size={20} />
                      </button>

                      <input
                        type="text"
                        value={captchaValue}
                        onChange={(event) =>
                          setCaptchaValue(event.target.value)
                        }
                        placeholder="Enter captcha"
                        autoComplete="off"
                        className="flex-1 min-w-30 px-3 py-1.5 ms-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />

                      {captchaError && (
                        <p className="text-xs text-red-500 mt-1 ms-2">
                          {captchaError}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* OTP Input */}
                {otpSent && (
                  <div>
                    <TextInput
                      label="Enter OTP"
                      name="otp"
                      type="text"
                      placeholder="Enter 4-digit OTP"
                      value={otp}
                      maxLength={4}
                      onChange={(event) =>
                        setOtp(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4)
                        )
                      }
                      required
                      style="py-3"
                    />

                    <div className="flex flex-wrap justify-between items-center gap-2 mt-2">

                      <p className="text-xs text-gray-500">
                        OTP sent to{" "}
                        <span className="font-semibold text-gray-700">
                          {currentValue}
                        </span>
                      </p>

                      <button
                        type="button"
                        onClick={(e) => handleSendOTP(e, true)}
                        disabled={isLoading || resendTimer > 0}
                        className="text-xs font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {resendTimer > 0
                          ? `Resend OTP in ${resendTimer}s`
                          : "Resend OTP"}
                      </button>

                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  (otpSent && otp.length !== 4)
                }
                className="w-full py-3 bg-linear-to-r from-primary to-primary/70 hover:from-primary hover:to-primary text-white font-medium rounded-lg transition-all duration-300 shadow-lg disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed active:scale-[0.98] text-sm"
              >
                {isLoading
                  ? "Please wait..."
                  : otpSent
                    ? "Verify OTP & Sign In"
                    : "Send OTP"}
              </button>

              {/* Change Email / Mobile */}
              {otpSent && (
                <button
                  type="button"
                  onClick={handleChangeContact}
                  className="w-full mt-4 text-sm text-gray-500 hover:text-primary"
                >
                  Change {loginType === "email" ? "Email" : "Mobile Number"}
                </button>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;