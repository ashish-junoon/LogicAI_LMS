import { PiFlowerTulipBold } from "react-icons/pi";

// Access denied page
const AccessDenied = () => {
  return (
    <div className="fixed inset-0 left-0 lg:left-64 flex flex-col items-center justify-center text-center px-6 bg-gray-50">
      <div className="w-[100px] h-[100px] rounded-full bg-primary/10 flex items-center justify-center mb-6 shrink-0">
        <PiFlowerTulipBold size={50} className="text-primary animate-pulse" />
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome to Loan Management System
      </h1>

      <p className="text-gray-500 max-w-xl">
        Welcome! We're glad to have you here.
      </p>
    </div>
  );
};

export default AccessDenied;