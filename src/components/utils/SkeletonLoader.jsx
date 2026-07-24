import React from "react";

const SkeletonLoader = () => {
  return (
    <div>
      <div
        role="status"
        className="max-w-full p-4 border border-default rounded-base shadow-xs animate-pulse md:p-6"
      >
        <div
          role="status"
          className="flex items-center justify-center h-48 max-w-full bg-gray-300 rounded-base animate-pulse mb-4 sm:mb-6"
        >

          <span className="sr-only">Loading...</span>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full w-48 mb-4"></div>
        <div className="h-2 bg-gray-300 rounded-full mb-2.5"></div>
        <div className="h-2 bg-gray-300 rounded-full mb-2.5"></div>
        <div className="h-2 bg-gray-300 rounded-full"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default SkeletonLoader;
