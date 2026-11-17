
import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { LuShieldAlert } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const RateLimitPage = ({ onGoBack }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-gray-50 px-4">
  <div className="w-full max-w-md mx-auto text-center">

        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6">
          <LuShieldAlert size={42} className="text-orange-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Too Many Attempts!
        </h1>

        <p className="text-gray-500 mb-5">
          You have made too many requests in a short period of time.
          Please try again later.
        </p>

        <p className="text-sm text-gray-400 mt-6 mb-7">
          Please wait before accessing the application again.
        </p>

        <button
          onClick={onGoBack}
          className="w-full flex items-center justify-center gap-2 bg-[#0f5c4d] hover:bg-[#094638] text-white font-semibold py-3 px-5 rounded-xl transition"
        >
          <BsArrowLeft size={18} />
          Go Back
        </button>

      </div>
    </div>
  );
};

export default RateLimitPage;
