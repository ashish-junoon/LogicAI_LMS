import React, { useState } from "react";
import {
  RiShieldCheckLine,
  RiSmartphoneLine,
  RiLockPasswordLine,
  RiVideoChatLine,
  RiCameraLine,
  RiMicLine,
  RiCheckLine,
  RiArrowRightLine,
  RiUserLine,
  RiTimeLine,
  RiInformationLine,
  RiCloseLine,
} from "react-icons/ri";

const ClientLiveKYC = () => {
  const [step, setStep] = useState("mobile");

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [cameraAllowed, setCameraAllowed] = useState(false);
  const [micAllowed, setMicAllowed] = useState(false);

  const questions = [
    "Please show your original Aadhaar Card to the camera.",
    "Please tell us your full name and date of birth.",
    "Please show your PAN Card clearly to the camera.",
    "Please look directly into the camera and blink twice.",
    "Please turn your face slightly to the left and then to the right.",
    "Please confirm the purpose for which you are applying for this loan.",
  ];

  // -----------------------------
  // MOBILE
  // -----------------------------

  const handleSendOtp = () => {
    if (mobile.length !== 10) return;

    // TODO API
    console.log("Send OTP:", mobile);

    setStep("otp");
  };

  // -----------------------------
  // OTP
  // -----------------------------

  const handleVerifyOtp = () => {
    if (otp.length !== 6) return;

    // TODO API
    console.log("Verify OTP:", otp);

    setStep("instructions");
  };

  // -----------------------------
  // CAMERA / MIC
  // -----------------------------

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log("Media Stream:", stream);

      setCameraAllowed(true);
      setMicAllowed(true);

      // TODO WebRTC signaling/API
      setStep("waiting");
    } catch (error) {
      console.error("Camera/Mic permission denied", error);
    }
  };

  // -----------------------------
  // ANSWER QUESTION
  // -----------------------------

  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setStep("completed");
    }
  };

  // -----------------------------
  // UI
  // -----------------------------

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-5xl">

        {/* ============================
            HEADER
        ============================ */}

        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 mb-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <RiShieldCheckLine size={25} />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-slate-800">
                  Live Video KYC
                </h1>

                <p className="text-xs text-slate-500">
                  Secure identity verification
                </p>
              </div>

            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <RiShieldCheckLine size={16} />
              Secure & Encrypted
            </div>

          </div>

        </div>


        {/* ============================
            MOBILE VERIFICATION
        ============================ */}

        {step === "mobile" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="max-w-md mx-auto px-6 py-10">

              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5">
                <RiSmartphoneLine size={32} />
              </div>

              <h2 className="text-xl font-semibold text-center text-slate-800">
                Verify Your Mobile Number
              </h2>

              <p className="text-sm text-slate-500 text-center mt-2 mb-7">
                Enter the mobile number registered with your KYC application.
              </p>

              <label className="text-sm font-medium text-slate-700">
                Mobile Number
              </label>

              <div className="flex mt-2 border border-slate-300 rounded-xl overflow-hidden focus-within:border-primary">

                <div className="px-3 flex items-center bg-slate-50 border-r text-sm text-slate-600">
                  +91
                </div>

                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter mobile number"
                  className="flex-1 px-3 py-3 outline-none text-sm"
                />

              </div>

              <button
                onClick={handleSendOtp}
                disabled={mobile.length !== 10}
                className="w-full mt-5 py-3 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue
                <RiArrowRightLine size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 mt-5 text-xs text-slate-400">
                <RiLockPasswordLine />
                Your information is securely protected
              </div>

            </div>

          </div>
        )}


        {/* ============================
            OTP
        ============================ */}

        {step === "otp" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            <div className="max-w-md mx-auto px-6 py-10">

              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-5">
                <RiLockPasswordLine size={30} />
              </div>

              <h2 className="text-xl font-semibold text-center text-slate-800">
                Enter OTP
              </h2>

              <p className="text-sm text-slate-500 text-center mt-2">
                We have sent a 6-digit OTP to
              </p>

              <p className="text-sm font-semibold text-slate-700 text-center mt-1">
                +91 {mobile}
              </p>

              <div className="mt-7">

                <input
                  type="tel"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit OTP"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-center tracking-[0.5em] text-lg outline-none focus:border-primary"
                />

              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6}
                className="w-full mt-5 py-3 rounded-xl bg-primary text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Verify OTP
                <RiCheckLine size={18} />
              </button>

              <button className="w-full mt-4 text-sm text-primary font-medium">
                Resend OTP
              </button>

              <p className="text-center text-xs text-slate-400 mt-5">
                OTP is valid for a limited time.
              </p>

            </div>

          </div>
        )}


        {/* ============================
            INSTRUCTIONS
        ============================ */}

        {step === "instructions" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="max-w-2xl mx-auto px-6 py-8">

              <div className="text-center mb-7">

                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <RiVideoChatLine size={32} />
                </div>

                <h2 className="text-xl font-semibold text-slate-800 mt-4">
                  Get Ready for Your Live KYC
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  Please complete the following before starting.
                </p>

              </div>


              <div className="grid sm:grid-cols-2 gap-3">

                <Instruction
                  icon={<RiCameraLine />}
                  title="Camera Required"
                  text="Keep your face clearly visible throughout the verification."
                />

                <Instruction
                  icon={<RiMicLine />}
                  title="Microphone Required"
                  text="Make sure your microphone is working properly."
                />

                <Instruction
                  icon={<RiUserLine />}
                  title="Be Alone"
                  text="Please complete the verification yourself."
                />

                <Instruction
                  icon={<RiInformationLine />}
                  title="Keep Documents Ready"
                  text="Keep your Aadhaar and PAN card nearby."
                />

              </div>


              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-5">

                <div className="flex gap-3">

                  <RiInformationLine
                    className="text-blue-600 mt-0.5 shrink-0"
                    size={19}
                  />

                  <p className="text-xs text-blue-700 leading-5">
                    During the KYC, a verification agent will connect with
                    you through a secure video call and guide you through
                    the verification process.
                  </p>

                </div>

              </div>


              <button
                onClick={requestPermissions}
                className="w-full mt-6 py-3 rounded-xl bg-primary text-white text-sm font-medium flex items-center justify-center gap-2"
              >
                Allow Camera & Microphone
                <RiArrowRightLine size={18} />
              </button>

            </div>

          </div>
        )}


        {/* ============================
            WAITING FOR AGENT
        ============================ */}

        {step === "waiting" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            <div className="max-w-md mx-auto px-6 py-12 text-center">

              <div className="relative w-20 h-20 mx-auto">

                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />

                <div className="relative w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <RiVideoChatLine size={35} />
                </div>

              </div>

              <h2 className="text-xl font-semibold text-slate-800 mt-7">
                Connecting You to an Agent
              </h2>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                Please stay on this page. A KYC verification agent
                will join the video call shortly.
              </p>


              <div className="mt-7 bg-slate-50 border border-slate-200 rounded-xl p-4">

                <div className="flex items-center justify-center gap-5">

                  <Permission
                    icon={<RiCameraLine />}
                    label="Camera"
                    active={cameraAllowed}
                  />

                  <Permission
                    icon={<RiMicLine />}
                    label="Microphone"
                    active={micAllowed}
                  />

                </div>

              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-6">
                <RiTimeLine />
                Please don't close or refresh this page
              </div>

              {/* DEMO BUTTON */}
              <button
                onClick={() => setStep("live")}
                className="mt-7 text-xs text-slate-400 hover:text-primary"
              >
                Demo: Join Video Call
              </button>

            </div>

          </div>
        )}


        {/* ============================
            LIVE VIDEO CALL
        ============================ */}

{step === "live" && (
  <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-xl">

    {/* TOP BAR */}
    <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
          <RiUserLine size={19} />
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            Live KYC Verification
          </p>

          <p className="text-[11px] text-slate-400">
            Verification Agent
          </p>
        </div>

      </div>

      <div className="flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-xs">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        LIVE
      </div>

    </div>


    {/* VIDEO */}
    <div className="relative aspect-video bg-slate-900">

      {/* Agent Video */}
      <div className="absolute inset-0 flex items-center justify-center">

        <div className="text-center text-white">

          <div className="w-20 h-20 rounded-full bg-primary/30 mx-auto flex items-center justify-center">
            <RiUserLine size={40} />
          </div>

          <p className="mt-3 text-sm font-medium">
            KYC Verification Agent
          </p>

          <p className="text-xs text-emerald-400 mt-1">
            Connected
          </p>

        </div>

      </div>


      {/* Client Self View */}
      <div className="absolute right-4 bottom-4 w-32 sm:w-40 aspect-video rounded-xl bg-slate-800 border border-white/20 overflow-hidden">

        <div className="h-full flex items-center justify-center text-slate-400">
          <RiUserLine size={28} />
        </div>

        <span className="absolute bottom-2 left-2 text-[10px] text-white">
          You
        </span>

      </div>

    </div>


    {/* CURRENT INSTRUCTION */}
    <div className="bg-white px-4 sm:px-6 py-5">

      <div className="flex items-center justify-between mb-3">

        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Current Verification
        </p>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
          <RiShieldCheckLine size={15} />
          Secure Session
        </div>

      </div>


      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">

        <div className="flex gap-3">

          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <RiInformationLine size={19} />
          </div>

          <div>

            <p className="text-[11px] text-slate-400 mb-1">
              Please follow the agent's instructions
            </p>

            <p className="text-sm sm:text-base font-medium text-slate-800 leading-6">
              {questions[currentQuestion]}
            </p>

          </div>

        </div>

      </div>


      {/* SESSION STATUS */}
      <div className="flex items-center justify-center gap-5 mt-5">

        <div className="flex items-center gap-2">

          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <RiCameraLine size={17} />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-700">
              Camera
            </p>

            <p className="text-[10px] text-emerald-600">
              Active
            </p>
          </div>

        </div>


        <div className="flex items-center gap-2">

          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <RiMicLine size={17} />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-700">
              Microphone
            </p>

            <p className="text-[10px] text-emerald-600">
              Active
            </p>
          </div>

        </div>

      </div>


      {/* WAITING MESSAGE */}
      <div className="text-center mt-5">

        <p className="text-xs text-slate-400">
          Please follow the instructions provided by the verification agent.
        </p>

      </div>

    </div>

  </div>
)}


        {/* ============================
            COMPLETED
        ============================ */}

        {step === "completed" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">

            <div className="max-w-md mx-auto px-6 py-12 text-center">

              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <RiCheckLine size={42} />
              </div>

              <h2 className="text-2xl font-semibold text-slate-800 mt-5">
                KYC Completed
              </h2>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                Your Live Video KYC has been successfully completed.
                Your application will now proceed for further processing.
              </p>


              <div className="mt-7 bg-emerald-50 border border-emerald-100 rounded-xl p-4">

                <div className="flex items-center justify-center gap-2 text-emerald-700">
                  <RiShieldCheckLine size={20} />

                  <span className="text-sm font-medium">
                    Identity Verification Successful
                  </span>
                </div>

              </div>


              <p className="text-xs text-slate-400 mt-6">
                You may now safely close this window.
              </p>

            </div>

          </div>
        )}


        {/* FOOTER */}

        <div className="text-center mt-4 text-[11px] text-slate-400">
          Your KYC session is secure and encrypted.
        </div>

      </div>

    </div>
  );
};


// ========================================
// INSTRUCTION CARD
// ========================================

const Instruction = ({ icon, title, text }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-4">

      <div className="flex gap-3">

        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">
            {title}
          </p>

          <p className="text-xs text-slate-500 mt-1 leading-5">
            {text}
          </p>
        </div>

      </div>

    </div>
  );
};


// ========================================
// PERMISSION STATUS
// ========================================

const Permission = ({ icon, label, active }) => {
  return (
    <div className="flex items-center gap-2">

      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          active
            ? "bg-emerald-100 text-emerald-600"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {icon}
      </div>

      <div className="text-left">

        <p className="text-xs font-medium text-slate-700">
          {label}
        </p>

        <p className="text-[10px] text-emerald-600">
          Allowed
        </p>

      </div>

    </div>
  );
};

export default ClientLiveKYC;