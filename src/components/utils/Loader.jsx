const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-md">
            <div className="flex flex-col items-center gap-4">
                
                {/* Spinner */}
                <div className="relative h-12 w-12">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary"></div>
                </div>

                {/* Loading Text */}
                <p className="text-sm font-medium text-gray-600">
                    {text}
                </p>

            </div>
        </div>
    );
};

export default Loader;